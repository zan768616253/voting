import Eventproxy from 'eventproxy';

import { List, Map } from 'immutable';

import { INITIAL_STATE } from './core'

export default function reducer(state = INITIAL_STATE, action) {
    console.log('reducer state: ' + JSON.stringify(state.toJS()));
    console.log('reducer action: ' + JSON.stringify(action));
    switch (action.type) {
        case 'SET_ENTRIES':
            console.log('begin SET_ENTRIES');
            if (action.status === 'COMPLETED') {
                return state.set('pair', List(action.pair));
            } else {
                return state;
            }
        case 'STAT':
            console.log('begin STAT');
            break;
        case 'VOTE':
            console.log('begin VOTE');
            break;
    }
    return state;
}