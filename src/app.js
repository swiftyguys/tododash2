import Map from "can/map/";
import route from "can/route/";
import 'can/map/define/';
import 'can/route/pushstate/';

const AppViewModel = Map.extend( {
    define: {
        message: {
            value: 'Hello World!',
            serialize: false
        },
        title: {
            value: 'donejsgun',
            serialize: false
        }
    }
} );

route('/:page', { page: 'home' });

export default AppViewModel;
