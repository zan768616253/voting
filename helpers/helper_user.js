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
		console.log('UserHelper.encryptPassword time: %d', time);
		const encrypted = encryptionHelper.encrypt(password, salt+email, time);
		console.log('UserHelper.encryptPassword encrypted: %s', encrypted);
		return encrypted;
	}

	createUser (email, password, name, length) {
		return new Promise((resolve, reject) => {
			console.log('UserHelper.createUser email: %s', email);
			console.log('UserHelper.createUser password: %s', password);
			console.log('UserHelper.createUser name: %s', name);
			console.log('UserHelper.createUser length: %d', length);

			const salt = encryptionHelper.generateSalt(Math.abs(length) % 50);
			console.log('UserHelper.createUser salt: %s', salt);
			const encryptedPassword = this.encryptPassword(email, password, salt);

			const user = new models.User();
			user.email = email;
			user.name = name;
			user.password = encryptedPassword;
			user.salt = salt;
			user.type = 'local';

			console.log('UserHelper.createUser before user.save');
			user.save((err) => {
				if (err) {
					console.log('UserHelper.createUser err %s', err.message);
					reject(err);
				}
				resolve(user);
			})
		})
	}

	login () {

	}
}

export default UserHelper;