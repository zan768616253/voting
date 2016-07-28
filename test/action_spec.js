import faker from 'faker';

import { expect } from 'chai';

import * as actionCreator from '../src/actions';
import util from './util';

describe('actions test', () => {
	let email, password, name, seed;

	before(() => {
		email = faker.internet.email();
		name = faker.internet.userName();
		password = '12345678';
		seed = [
			Math.floor(Math.random()*2) ? Math.floor(Math.random()*Number.MAX_SAFE_INTEGER) : Math.floor(Math.random()*Number.MIN_SAFE_INTEGER),
			Math.floor(Math.random()*2) ? Math.floor(Math.random()*Number.MAX_SAFE_INTEGER) : Math.floor(Math.random()*Number.MIN_SAFE_INTEGER),
			Math.floor(Math.random()*2) ? Math.floor(Math.random()*Number.MAX_SAFE_INTEGER) : Math.floor(Math.random()*Number.MIN_SAFE_INTEGER),
			Math.floor(Math.random()*2) ? Math.floor(Math.random()*Number.MAX_SAFE_INTEGER) : Math.floor(Math.random()*Number.MIN_SAFE_INTEGER),
			Math.floor(Math.random()*2) ? Math.floor(Math.random()*Number.MAX_SAFE_INTEGER) : Math.floor(Math.random()*Number.MIN_SAFE_INTEGER)
		];
	});

	it('create user', (done) => {
		const store = util.mockStore(done);
		store.dispatch(actionCreator.createUser(email, password, password, name, seed));
	})
})