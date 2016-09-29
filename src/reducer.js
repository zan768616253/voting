import Eventproxy from 'eventproxy';

import { List, Map } from 'immutable';

import { INITIAL_STATE } from './core'

export default function reducer(state = INITIAL_STATE, action) {
    console.log('reducer state: ' + JSON.stringify(state.toJS()));
    console.log('reducer action: ' + JSON.stringify(action));

    switch (action.type) {
        case 'SET_ENTRIES':
            console.log('begin SET_ENTRIES status: ' + action.status);
            if (action.status === 'COMPLETED') {
                return state.set('pair', List(action.pair)).set('action', action.type);
            }
        case 'STAT':
            console.log('begin STAT');
            break;
        case 'VOTE':
            console.log('begin VOTE status: ' + action.status);
            if (action.status === 'COMPLETED') {
                return state.set('pair', List(action.pair)).set('action', action.type);
            }
		    break;
	    case 'LOGIN':
		    console.log('begin LOGIN status: ' + action.status);
		    if (action.status === 'COMPLETED') {
				return state.set('session', action.session).set('action', action.type);
		    }
		    break;
    }
    return state;
}