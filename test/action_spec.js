import faker from 'faker';

import { expect } from 'chai';

import * as actionCreator from '../src/actions';
import util from './util';

describe('actions test', () => {
	let email, password, name, device, ip, seed;

	before(() => {
		email = faker.internet.email();
		name = faker.internet.userName();
		ip = faker.internet.ip();
		password = '12345678';
		device = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36';

		seed = [
			Math.floor(Math.random()*2) ? Math.floor(Math.random()*Number.MAX_SAFE_INTEGER) : Math.floor(Math.random()*Number.MIN_SAFE_INTEGER),
			Math.floor(Math.random()*2) ? Math.floor(Math.random()*Number.MAX_SAFE_INTEGER) : Math.floor(Math.random()*Number.MIN_SAFE_INTEGER),
			Math.floor(Math.random()*2) ? Math.floor(Math.random()*Number.MAX_SAFE_INTEGER) : Math.floor(Math.random()*Number.MIN_SAFE_INTEGER),
			Math.floor(Math.random()*2) ? Math.floor(Math.random()*Number.MAX_SAFE_INTEGER) : Math.floor(Math.random()*Number.MIN_SAFE_INTEGER),
			Math.floor(Math.random()*2) ? Math.floor(Math.random()*Number.MAX_SAFE_INTEGER) : Math.floor(Math.random()*Number.MIN_SAFE_INTEGER)
		];
	});

	//it('create user', (done) => {
	//	const store = util.mockStore(done);
	//	store.dispatch(actionCreator.createUser(email, password, password, name, seed));
	//})

	//it('create session', (done) => {
	//	const store = util.mockStore(done);
	//	store.dispatch(actionCreator.createSession(email, device, ip, seed));
	//})
})