import Eventproxy from 'eventproxy';

import { setEntries, next, vote, INITIAL_STATE } from './core'

import helpers from '../helpers';

const faceHelper = new helpers.FaceHelper();

export default function reducer(state = INITIAL_STATE, action) {
    //console.log('state: ' + JSON.stringify(state));
    //console.log('action: ' + JSON.stringify(action));
    switch (action.type) {
        case 'SET_ENTRIES':
            return setEntries(state, action.entries);
            break;
        case 'NEXT':
            return next(state);
            break;
        case 'VOTE':
            return state.update('vote', voteState => vote(voteState, action.entry))
            break;
    }
    return state;
}

function vote(state, entry) {
    const ep = new Eventproxy();
    ep.fail((err) => {
        console.log(err.message);
        return state.update('status', 500);
    });

    ep.once('vote', () => {

    });

    faceHelper.vote(entry).then(() => {
        ep.emit('vote', true);
    }).catch((err) => {
        ep.emit('error', new Error('faceHelper.vote err: ' + err.message));
    })
}