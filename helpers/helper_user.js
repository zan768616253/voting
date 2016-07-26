import Eventproxy from 'eventproxy';

import models from '../models';

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

	createUser (email, password, name) {
		return new Promise((resolve, reject) => {

			const user = new models.User();
		})
	}
}

export default UserHelper;