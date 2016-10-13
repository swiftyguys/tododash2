import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './chat.less!';
import template from './chat.stache!';

import appdata from '../model/appdata';

export const ViewModel = Map.extend( {
    send( event ) {
        event.preventDefault();

        new Message( {
            name: this.attr( 'name' ),
            body: this.attr( 'body' )
        } ).save().then( msg => this.attr( 'body', '' ) );

    },

    clickAddBlip( chat ) {
        if( typeof chat.attr( 'blips' ) !== 'object' ) {
            chat.attr( 'blips', new Map.List() );
        }
        chat.attr( 'blips' ).push( { content: 'blip_' + Math.random(), __inserting__: Math.random() } );
    },

    clickAddMember( blip ) {
        if( typeof blip.attr( 'members' ) === 'undefined' ) {
            blip.attr( 'members', new Map.List() );
        }
        blip.attr( 'members' ).push( { code: 'member_' + Math.random(), __inserting__: Math.random() } );
    },

    chats: appdata.chats

} );

export default Component.extend( {
    tag: 'tdd-chat',
    viewModel: ViewModel,
    template,
    // init: function(element, options){
    //     var self = this;
    // }
} );
