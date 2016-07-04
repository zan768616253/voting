import thunk from 'redux-thunk'
//import logger from 'redux-logger'

import { createStore, applyMiddleware } from 'redux';

import reducer from './reducer';

const loggerMiddleware = createLogger();

export default function makeStore() {
    return createStore(
        reducer,
        applyMiddleware(thunk)
    );
}