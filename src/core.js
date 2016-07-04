import Eventproxy from 'eventproxy';

import { List, Map } from 'immutable';
//
//export function setEntries (state) {
//    console.log('begin core setEntries');
//    let newState = Map();
//    faceHelper.getFacePair().then((pair) => {
//        console.log('core.setEntries state: ' + JSON.stringify(state.toJS()));
//        newState = state.set('pair', List(pair));
//        console.log('core.setEntries newState: ' + JSON.stringify(newState.toJS()));
//    }).catch((err) => {
//        console.log('core.setEntries err: ' + err.message);
//    });
//
//    return newState;
//}

//export function vote(state, entry) {
//    console.log('state: ');
//    console.log(state.toJS());
//    console.log('entry: ');
//    console.log(entry);
//
//    const ep = new Eventproxy();
//    ep.fail((err) => {
//        console.log(err.message);
//    });
//
//    ep.once('new_pair', pair => {
//        const new_state = state.updateIn('vote', 'pair', pair);
//        console.log('vote.new_pair: ' + JSON.stringify(new_state));
//        return new_state;
//    });
//
//    ep.once('vote', () => {
//        faceHelper.getFacePair().then((pair) => {
//            console.log('vote.faceHelper.getFacePair ok');
//            emit('new_pair', pair);
//        }).catch((err) => {
//            console.log('vote.faceHelper.getFacePair err');
//            emit('error', err);
//        });
//    });
//
//    faceHelper.vote(entry).then(() => {
//        console.log('vote.faceHelper.vote ok');
//        ep.emit('vote', true);
//    }).catch((err) => {
//        console.log('vote.faceHelper.vote err');
//        ep.emit('error', new Error('faceHelper.vote err: ' + err.message));
//    })
//}

export const INITIAL_STATE = Map();