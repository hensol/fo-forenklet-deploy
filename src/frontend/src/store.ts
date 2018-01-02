import { createStore, applyMiddleware, compose, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import websocketMiddleware from './websocket/websocket';
import reducer from './redux/reducer';
import AppState from './redux/app-state';

function create() {
    /* tslint:disable-next-line */
    const useExtension = (window as any).__REDUX_DEVTOOLS_EXTENSION__ !== undefined;
    /* tslint:disable-next-line */
    const composer = useExtension ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

    const composed = composer(
        applyMiddleware(thunkMiddleware, websocketMiddleware)
    );

    return composed(createStore)(reducer, {});
}

let store: Store<AppState>;
export default function getStore(): Store<AppState> {
    if (!store) {
        store = create();
    }
    return store;
}