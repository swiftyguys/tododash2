import Map from 'can/map/';
import basedata from '../basedata';
import extend from 'extend';

var gun = basedata.server;

var mapsActive = {};

var isMapActive = function( soul, key ) {
    var id = soul + '-_-' + key;
    var ret = mapsActive[ id ];
    if( mapsActive[ id ] ) {
        ret = true;
    }
    mapsActive[ id ] = true;
    return ret;
};

var mapNodes = function( soul, key, gunBase, mapList, level ) {
    if( ! isMapActive( soul, key ) ) {
        // dorh you can always do chats.map().on(updates).val(once) to get updates too.
        // map(cb) gets called for every item in the list (and new ones as they are added), and when the items update.
        // map().on(cb) same thing
        // map().val(cb) gets called for every item in the list (and new ones as they are added), but only once for each item, no updates.
        // val().map(cb) (NOT AVAILABLE YET) in the future will get called for every item in the list, that is currently known, no added items or updates.
        // actually in the future, we're also going to have map(cb) the cb will be a transform/filter function.
        gunBase.map()
        .on( function( nodeObj ) {
            console.log( 'ON', nodeObj );
            if( typeof nodeObj === "object" ) {
                var id = nodeObj[ '_' ][ '#' ];
                console.log( 'id 111', nodeObj[ '_' ][ '#' ] );
                var nodeGun = gun.get( id );
                level = gun2list( nodeGun, nodeObj, mapList, level++ );
            }
        } )
        .val( function( nodeObj ) {
            // console.log( 'VAL', nodeObj );
            // if( typeof nodeObj === "object" ) {
            //     var id = nodeObj[ '_' ][ '#' ];
            //     var nodeGun = gun.get( id );
            //     level = gun2list( nodeGun, nodeObj, mapList, level++ );
            // }
        }, true );
    }

    return level;
};

var cloneNodeObj = function( newMap, nodeObj, nodeGun, level ) {
    var id = nodeObj[ '_' ][ '#' ];
    var newNode = extend( true, {}, nodeObj );
    delete newNode[ '_' ];
    newNode.id = id;

    var newObj = {};

    for( var key in newNode ) {
        if( newNode.hasOwnProperty( key ) ) {
            if( newNode[ key ] && typeof newNode[ key ] === 'object' ) {
                if( typeof newNode[ key ][ '#' ] !== 'undefined' ) {
                    if( level < 10 ) {
                        var subList = newMap.attr( key );
                        if( typeof subList === 'undefined' ) {
                            subList = new Map.List();
                            newObj[ key ] = subList;
                        }
                        level = mapNodes( id, key, nodeGun.path( key ), subList, level );
                    } else {
                        // dorh Not going any deeper. What to do with the property?
                    }
                } else {
                    // dorh plain object? Add to newMap?
                }
            } else {
                newObj[ key ] = newNode[ key ];
            }
        }
    }

    newMap.attr( newObj );

    if( nodeObj.__inserting__ ) {
        setTimeout( function() {
            // nodeGun.path( '__inserting__' ).put( null );
        }, 5000 );
    }

    return level;
};

var gun2list = function( nodeGun, nodeObj, mapList, level ) {
    // nodeGun.val( function( nodeObj ) {
        var newId = nodeObj[ '_' ][ '#' ];
        var mapItem = null;

        mapList.forEach( function( mapItm/*, index, list*/ ) {
            if( mapItm.attr( 'id' ) === newId ) {
                mapItem = mapItm;
            }
        } );

        if( ! mapItem ) {
            console.log( 'MapItem not found by id', mapList.attr(), newId );
            mapList.forEach( function( mapItm/*, index, list*/ ) {
                if( mapItm.attr( '__inserting__' ) && mapItm.attr( '__inserting__' ) === nodeObj.__inserting__ ) {
                    mapItem = mapItm;
                }
            } );
        }

        var isNew = 0;
        if( ! mapItem ) {
            mapItem = new Map();
            isNew = 1;
            // console.log( 'FOUND NEW', mapItem, newId );
        } else {
            // console.log( 'FOUND EXISTING' );
        }

        level = cloneNodeObj( mapItem, nodeObj, nodeGun, level );

        if( isNew ) {
            mapList.push( mapItem );
        }
    // } );

    return level;
};

var handleChange = function( mapList, ev, index, how, newVal, oldVal ) {
    var pathParts = index.split( '.' );
    if( pathParts.length > 1 ) {
        var path = pathParts[ 1 ];

        if( pathParts.length > 3 ) {
            // For instance: 1.blips.1.members.0
            var ix = pathParts[ 0 ] + '.' + pathParts[ 1 ];
            var newIndex = index.substr( ix.length + 1 );
            var newMapList = mapList.attr( ix );
            handleChange( newMapList, ev, newIndex, how, newVal, oldVal );

        } else {
            var id = mapList.attr( pathParts[ 0 ] ).attr( 'id' );

            // dorh Multiple servers
            // dorh Encryption
            // dorh Searchability

            if( how === 'set' ) {
                if( path !== 'id' ) {
                    // gun.get( id ).path( path ).put( newVal );
                }
            }

            if( how === 'add' ) {
                console.log( 'ADD', mapList, id, index, path );
                if( mapList.attr( index ) instanceof Map.List ) {
                    // A property is added and it is a Map.List.
                    // So we need to create a new Gun node for the list and create a link to that new node in our node.
                    // Adding an empty Map.List to init a property, like
                    // chat.attr( 'blips', new Map.List() );
                    // triggers an add event.

                    // Not needed for now. The Gun node for the list will be created automatically when the first node is added.
                    // gun.get( id ).path( path ).put( 'qqq' );
                } else {
                    // dorh Deeper paths than 0.blips.0
                    // dorh Will not always be an array?
                    if( typeof newVal === 'object' ) {
                        var newObj = newVal[ 0 ].attr();
                        // delete newObj.__inserting__;
                        delete newObj.id;
                        console.log( 'PUT', newObj, id, path );
                        var newGunNode = gun.put( newObj );
                        gun.get( id ).path( path ).set( newGunNode );
                    }
                }
            }
        }
    }
};

var initGunMapList = function( key, mapList/*, CbEachNode*/ ) {
    mapNodes( '', key, gun.get( key ), mapList, 0 );

    mapList.bind( 'change', function( ev, index, how, newVal, oldVal ) {
        console.log( 'An element changed.', ev, index, how, newVal, oldVal );

        if( index.substr( index.length -3 ) === '.id' ) {
            console.log( '===ID' );
        } else {
            handleChange( mapList, ev, index, how, newVal, oldVal );
        }
    } );
};

export default initGunMapList;
