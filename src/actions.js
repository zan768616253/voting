import Eventproxy from 'eventproxy';

import helpers from '../helpers';

const faceHelper = new helpers.FaceHelper();

export const SET_ENTRIES = 'SET_ENTRIES';
export function setEntries() {
	return function(dispatch) {
		faceHelper.getFacePair().then((pair) => {
			dispatch({ type: 'SET_ENTRIES', status: 'COMPLETED',  pair: pair});
		}).catch((err) => {
			console.log(err.message);
			dispatch({ type: 'SET_ENTRIES', status: 'ERROR' });
		})
	}
}

export const VOTE  = 'VOTE';
export function vote(_id) {
	return function(dispatch) {
		const ep = new Eventproxy();

		ep.fail((err) => {
			console.log(err.message);
			dispatch({ type: 'VOTE', status: 'ERROR' });
		});

		ep.once('vote', () => {
			faceHelper.getFacePair().then((pair) => {
				console.log('vote.faceHelper.getFacePair ok');
                dispatch({ type: 'VOTE', status: 'COMPLETED', pair: pair })
			}).catch((err) => {
	            console.log('vote.faceHelper.getFacePair err: ' + err.message);
	            emit('error', err);
	        });
		});

	    faceHelper.vote(_id).then(() => {
	        console.log('vote.faceHelper.vote ok');
	        ep.emit('vote', true);
	    }).catch((err) => {
	        console.log('vote.faceHelper.vote err');
	        ep.emit('error', new Error('faceHelper.vote err: ' + err.message));
	    });
	}
}