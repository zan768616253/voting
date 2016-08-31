import co from 'co';
import _ from 'lodash';
import Eventproxy from 'eventproxy';

import util from './util';
import helpers from '../helpers';

const faceHelper = new helpers.FaceHelper();
const userHelper = new helpers.UserHelper();

export const SET_ENTRIES = 'SET_ENTRIES';
export function setEntries() {
	return function(dispatch) {
		faceHelper.getFacePair().then((pair) => {
			dispatch({ type: SET_ENTRIES, status: 'COMPLETED',  pair: pair});
		}).catch((err) => {
			console.log(err.message);
			dispatch({ type: SET_ENTRIES, status: 'ERROR' });
		})
	}
}

export const VOTE  = 'VOTE';
export function vote(_id) {
	return function(dispatch) {
		const ep = new Eventproxy();

		ep.fail((err) => {
			console.log(err.message);
			dispatch({ type: VOTE, status: 'ERROR' });
		});

		ep.once('vote', () => {
			faceHelper.getFacePair().then((pair) => {
				console.log('vote.faceHelper.getFacePair ok');
                dispatch({ type: VOTE, status: 'COMPLETED', pair: pair })
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

export const CREATEUSER = 'CREATEUSER';
export function createUser(email, pwd, name, seed) {
	return function (dispatch) {
		if (email && pwd && name && seed && seed.length === 5) {
			console.log('actions.createUser params are valid');

			const ep = new Eventproxy();

			ep.fail(err => {
				console.log('actions.createUser fail due to err: %s', err.message);
				util.dispatchError(dispatch, CREATEUSER, 'Internal server error.', err.message);
			});

			ep.once('not available', () => {
				console.log('actions.createUser email is not available');
				util.dispatchError(dispatch, CREATEUSER, 'Internal server error', 'Email is been used');
			});

			ep.all('user', 'history', (user, history) => {
				console.log('actions.createUser success');
				dispatch({
					type: CREATEUSER,
					status: 'COMPLETED',
					user: user
				});
			});

			ep.once('available', () => {
				console.log('actions.createUser email is available');
				userHelper.createUser(email, pwd, name, _.head(seed)).then((user) => {
					console.log('actions.createUser ep.emit user');
					ep.emit('user', user);
				}).catch((err) => {
					ep.emit('error', err);
				});

				userHelper.createUserHistory(email, 'password', pwd).then((history) => {
					console.log('actions.createUser ep.emit history');
					ep.emit('history', history);
				}).catch(() => {
					ep.emit('error', err);
				});
			});

			userHelper.isEmailAvailable(email).then((result) => {
				if (result) {
					ep.emit('available', true);
				} else {
					ep.emit('not available', false);
				}
			}).catch(err => {
				ep.emit('error', err);
			});
		} else {
			console.log('actions.createUser params are invalid');
			util.dispatchError(dispatch, CREATEUSER, 'Unauthorized access.', 'Not enough parameters to create user');
		}
	}
}

export const CREATESESSION = 'CREATESESSION';
export function createSession(email, device, ip, seed) {
	return function (dispatch) {
		if (email && device && ip && seed && seed.length === 5) {
			userHelper.createSession(email, device, ip, seed).then(session => {
				dispatch({
					type: CREATESESSION,
					status: 'COMPLETED',
					session: session
				});
			}).catch(err => {
				util.dispatchError(dispatch, CREATESESSION, 'Internal server error', err.message);
			})
		} else {
			util.dispatchError(dispatch, CREATESESSION, 'Unauthorized access.', 'Not enough parameters to create session');
		}
	}
}

