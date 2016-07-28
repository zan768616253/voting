import faker from 'faker';

import { expect } from 'chai';

import EncryptionHelper from '../../helpers/helper_encryption';

const encryptionHelper = new EncryptionHelper();

describe('encryption helper test', () => {
	let salt = '', encrypted = '';
	let email, password;

	before(() => {
		email = faker.internet.email();
		password = '12345678';
	});

	//it('generate salt', () => {
	//	const length = Math.floor(Math.random() * 2) ? Math.floor(Math.random() * Number.MIN_SAFE_INTEGER) : Math.floor(Math.random()*Number.MAX_SAFE_INTEGER);
	//	console.log('length: %s', length);
	//
	//	salt = encryptionHelper.generateSalt(Math.abs(length) % 50);
	//	console.log('salt: %s \n', salt);
	//	expect(salt).to.be.ok;
	//})
	//
	//it('encrypt password', () => {
	//	const time = Math.floor(Math.hypot(email.length, salt.length) * 59 % 500) + 1000;
	//	console.log('time: %d', time);
	//	encrypted = encryptionHelper.encrypt(password, salt+email, time);
	//	console.log('encrypted: %s', encrypted);
	//	expect(salt).to.be.ok;
	//})


})