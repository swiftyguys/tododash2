import Gun from 'gun/gun';
// var Gun = require('gun/gun');

var gun = Gun( 'http://127.0.0.1:8081' );

// var gun = Gun( {
//     file: 'data.json',
//     s3: {
//         key: '', // AWS Access Key
//         secret: '', // AWS Secret Token
//         bucket: '' // The bucket you want to save into
//     }
// } );


// // gun.get('test')/*.path( 'test' )*/.put( {
// //     name: 'piet',
// //     body: 'duh'
// // } );
//
// var todo = gun.get('example/todo/data');
//
// todo.path( Gun.text.random() ).put( {
//     name: 'piet',
//     body: Gun.text.random()
// } );


localStorage.clear();
var chat1 = gun.put({ name: 'n1', body: 'b1' });
var chat2 = gun.put({ name: 'n2', body: 'b2' });
var chat3 = gun.put({ name: 'n3', body: 'b3' });
var chats = gun.get('chats');
chats.set(chat1);
chats.set(chat2);
chats.set(chat3);
// chats.map( function( node ) {
//     var id = node[ '_' ][ '#' ];
//     var blip1 = gun.put( { content: 'aaa' } );
//     gun.get( id ).path( 'blips' ).set( blip1 );
//     var blip2 = gun.put( { content: 'bbb' } );
//     gun.get( id ).path( 'blips' ).set( blip2 );
// } );
// chat1.val( function( node ) {
//     var blip1 = gun.put( { content: 'aaa' } );
//     gun.get( node[ '_' ][ '#' ] ).path( 'blips' ).set( blip1 );
//     var blip2 = gun.put( { content: 'bbb' } );
//     gun.get( node[ '_' ][ '#' ] ).path( 'blips' ).set( blip2 );
// } );


// // var chats = gun.get('test/chats');


var basedata = {
    server: gun,
    getNewSoul: function() {
        return Gun.text.random();
    }
};

export default basedata;
