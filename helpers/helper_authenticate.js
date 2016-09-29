import Eventproxy from 'eventproxy';
import cookie from 'cookie';

import models from '../models';

class AuthenticateHelper {
	constructor () {
	}

	checkAuth (seed, key, token) {
		return new Promise((resolve, reject) => {
			this.findSessionByKey(key).then(session => {
				resolve(true);
			}).catch(err => {
				reject(err);
			})
		})
	}

	findSessionByKey (key) {
		return new Promise((resolve, reject) => {
			models.Session.findOne({ key: key }).exec((err, session) => {
				if (err) {
					reject(err);
				} else if (!session) {
					reject(new Error ('Not exist'))
				} else {
					resolve(session);
				}
			})
		})
	}

	processCookie (cookie_string) {
		let cookies = Object.create(null);
		cookies = cookie.parse(cookie_string);
		console.log('processCookie.cookies: ' + JSON.stringify(cookies))
		return cookies;
	}
}

export default AuthenticateHelper;