import faker from 'faker';
import Random from 'random-js';

import { expect } from 'chai';

import UserHelper from '../../helpers/helper_user';

const userHelper = new UserHelper();
const random = new Random();

describe('user helper test', () => {
	let email, password, name;

	before(() => {
		email = faker.internet.email();
		name = faker.internet.userName();
		password = '12345678';
	});

	it('create user', (done) => {
		const length = random.integer(1, 2000);
		userHelper.createUser(email, password, name, length).then((result) => {
			console.log('create user result: %s', result);
			expect(result).to.be.ok;
			done();
		}).catch(err => {
			expect(result).to.be.undefined;
			done();
		})
	})

})