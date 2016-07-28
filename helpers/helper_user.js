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
		//console.log('UserHelper.encryptPassword time: %d', time);
		const encrypted = encryptionHelper.encrypt(password, salt+email, time);
		//console.log('UserHelper.encryptPassword encrypted: %s', encrypted);
		return encrypted;
	}

	createUser (email, password, name, length) {
		return new Promise((resolve, reject) => {
			//console.log('UserHelper.createUser email: %s', email);
			//console.log('UserHelper.createUser password: %s', password);
			//console.log('UserHelper.createUser name: %s', name);
			//console.log('UserHelper.createUser length: %d', length);

			const salt = encryptionHelper.generateSalt(Math.abs(length) % 50);
			//console.log('UserHelper.createUser salt: %s', salt);
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
			const subKey = encryptionHelper.generateSalt(16);
			const salt = encryptionHelper.generateSalt(Math.abs(_.last(seed)) % 50, seed);
			const time = Math.floor(Math.hypot(_.head(seed), _.last(seed) % 500)) + 1000;
			const key = encryptionHelper.encrypt(subKey, salt, time);
			console.log(key);

			const session = new models.Session();
			session.key = key;
			session.email = email;
			session.device = device;
			session.ip = ip;

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

	login () {

	}
}

export default UserHelper;