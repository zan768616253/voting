import _ from 'lodash';
import Eventproxy from 'eventproxy';

import models from '../models';
import EncryptionHelper from './helper_encryption';

const encryptionHelper = new EncryptionHelper();

class UserHelper {
	constructor () {
	}

	isEmailAvailable (email) {
		return new Promise((resolve, reject) => {
			models.User.where({'email': email}).count((err, count) => {
				if (err) {
					reject(new Error('isEmailAvailable err: ' + err.message));
				}
				if (count) {
					resolve(false);
				} else {
					resolve(true);
				}
			})
		})
	}

	encryptPassword (email, password, salt) {
		const time = Math.floor(Math.hypot(email.length, salt.length) * 59 % 500) + 1000;
		const encrypted = encryptionHelper.encrypt(password, salt+email, time);
		return encrypted;
	}

	createUser (email, password, name, seed, length) {
		return new Promise((resolve, reject) => {
			//console.log('UserHelper.createUser email: %s', email);
			//console.log('UserHelper.createUser password: %s', password);
			//console.log('UserHelper.createUser name: %s', name);
			//console.log('UserHelper.createUser length: %d', length);

			const salt = encryptionHelper.generateSalt(Math.abs(length) % 50, seed);
			console.log('UserHelper.createUser salt: %s', salt);
			const encryptedPassword = this.encryptPassword(email, password, salt);

			const user = new models.User();
			user.email = email;
			user.name = name;
			user.password = encryptedPassword;
			user.salt = salt;
			user.type = 'local';

			//console.log('UserHelper.createUser before user.save');
			user.save((err) => {
				if (err) {
					console.log('UserHelper.createUser err %s', err.message);
					reject(err);
				}
				resolve(user);
			})
		})
	}

	createSession (email, device, ip, seed) {
		return new Promise((resolve, reject) => {
			console.log('enter UserHelper.createSession');
			const subKey = encryptionHelper.generateSalt(16, seed);
			console.log('UserHelper.createSession.subKey: ' + subKey);
			const salt = encryptionHelper.generateSalt(Math.abs(_.last(seed)) % 50, seed);
			console.log('UserHelper.createSession.salt: ' + salt);
			const time = Math.floor(Math.hypot(_.head(seed), _.last(seed) % 500)) + 1000;
			console.log('UserHelper.createSession.time: ' + time);
			const key = encryptionHelper.encrypt(subKey, salt, time);
			console.log('UserHelper.createSession.key: ' + key);

			const session = new models.Session();
			console.log('UserHelper.createSession model value 1');
			session.key = key;
			console.log('UserHelper.createSession model value 2');
			session.email = email;
			console.log('UserHelper.createSession model value 3');
			session.device = device;
			console.log('UserHelper.createSession model value 4');
			session.ip = ip;

			console.log('UserHelper.createSession session: %s', JSON.stringify(session.toJSON()));

			session.save(err => {
				if (err) {
					console.log('UserHelper.createSession err %s', err.message);
					reject(err);
				}
				resolve(session);
			})
		});
	}

	createUserHistory (email, type, data) {
		return new Promise((resolve, reject) => {
			const userHistory = new models.UserHistory();
			userHistory.email = email;
			userHistory.type = type;
			userHistory.data = data;

			//console.log('UserHelper.createUserHistory before save');
			userHistory.save(err => {
				if (err) {
					console.log('UserHelper.createUserHistory err %s', err.message);
					reject(err);
				}
				resolve(userHistory)
			})
		})
	}

	findUserByEmail (email) {
		return new Promise((resolve, reject) => {
			models.User.findOne({ 'email': email }, (err, user) => {
				if (err) {
					reject(err)
				} else if (!user) {
					reject(new Error ('Not exist'))
				} else {
					resolve(user);
				}
			})
		})
	}

	login (email, password, seed, device, ip) {
		return new Promise((resolve, reject) => {
			const ep = new Eventproxy();
			ep.fail((err) => {
				console.log('UserHelper.login err %s', err.message);
				reject(err);
			});

			ep.once('session', session => {
				console.log('UserHelper.login.once.session session %s', session);
				resolve(session);
			})

			ep.once('user', user => {
				console.log('UserHelper.login.once.user: just before encodedPassword');
				console.log('UserHelper.login.once.user.email: %s', email);
				console.log('UserHelper.login.once.user.password: %s', password);
				console.log('UserHelper.login.once.user.salt: %s', user.salt);
				const encodedPassword = this.encryptPassword(email, password, user.salt);

				console.log('UserHelper.login.once.user.encodedPassword: ' + encodedPassword);
				console.log('UserHelper.login.once.user.password: ' + user.password);

				if (encodedPassword === user.password) {
					user.device = device;
					user.ip = ip;
					this.createSession(email, device, ip, seed).then((session) => {
						ep.emit('session', session);
					}).catch((err) => {
						console.log('UserHelper.login.once.user.createSession err %s', err.message);
						ep.emit('error', err);
					})
				} else {
					console.log('UserHelper.login.once.user err %s', 'user password is not corrected');
					ep.emit('error', new Error('email and password is not matched'))
				}
			})

			this.findUserByEmail(email).then(user => {
				console.log('UserHelper.login.findUserByEmail useer %s', user);
				ep.emit('user', user);
			}).catch(err => {
				console.log('UserHelper.login.findUserByEmail err %s', err.message);
				ep.emit('error', err)
			})
		})
	}
}

export default UserHelper;