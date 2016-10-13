import basedata from './basedata';
import chats from './chat';
import extend from 'extend';

var appdata = extend( true, {}, basedata, {
    chats: chats
} );

export default appdata;
