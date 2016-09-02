import cryptoJS from 'crypto-js';
import random from 'random-js';

class EncryptionHelper {
	constructor () {
		this.lengths = [512, 256, 128];
		this.wordArrays = {
			0: ['3','5','Y','6','z','u','R','o','t','N','F','l','i','2','0','S','j','A','d','4','C','U','M','a','p','n','q','r','T','Q','h','V','X','B','E','9','J','m','s','D','1','e','Z','g','b','G','7','W','k','O','8','H','y','c','I','w','v','L','f','K','x','P'],
			1: ['q','3','c','i','l','Q','p','1','t','y','7','v','a','2','h','j','S','0','A','4','E','V','f','N','9','P','H','Z','e','B','6','X','D','M','U','o','G','8','5','Y','r','O','F','w','z','T','L','g','b','k','R','W','x','n','d','u','C','K','m','s','J','I'],
			2: ['I','1','M','K','P','9','s','n','S','p','B','0','E','A','l','D','U','N','e','t','j','5','G','L','4','J','3','h','w','W','Q','H','Z','f','o','q','X','i','k','z','F','6','r','g','u','7','m','C','v','Y','a','O','2','R','8','d','c','T','V','x','y','b'],
			3: ['i','g','G','a','9','E','1','B','A','3','V','F','o','b','h','5','n','s','6','y','Q','W','S','N','I','7','t','j','Z','z','4','K','c','r','e','p','v','8','2','Y','T','0','M','u','X','l','k','R','D','C','w','q','m','J','x','d','O','U','f','P','L','H'],
			4: ['q','i','N','9','M','F','U','C','3','6','S','h','m','j','G','k','K','R','B','W','2','r','p','t','X','b','x','d','y','P','Z','v','0','1','c','o','5','V','7','E','l','L','O','z','T','f','Q','e','D','n','A','4','u','g','w','s','J','8','a','H','Y','I']
		}
	}

	generateSalt (length) {
		const seed = [
			Math.floor(Math.random()*2) ? Math.floor(Math.random()*Number.MAX_SAFE_INTEGER) : Math.floor(Math.random()*Number.MIN_SAFE_INTEGER),
			Math.floor(Math.random()*2) ? Math.floor(Math.random()*Number.MAX_SAFE_INTEGER) : Math.floor(Math.random()*Number.MIN_SAFE_INTEGER),
			Math.floor(Math.random()*2) ? Math.floor(Math.random()*Number.MAX_SAFE_INTEGER) : Math.floor(Math.random()*Number.MIN_SAFE_INTEGER),
			Math.floor(Math.random()*2) ? Math.floor(Math.random()*Number.MAX_SAFE_INTEGER) : Math.floor(Math.random()*Number.MIN_SAFE_INTEGER),
			Math.floor(Math.random()*2) ? Math.floor(Math.random()*Number.MAX_SAFE_INTEGER) : Math.floor(Math.random()*Number.MIN_SAFE_INTEGER)
		];
		//console.log('generateSalt seed: %s', seed);

		let text = '';
		let _size = 0;
		try {
			const wordArray = this.wordArrays[Math.abs(seed[0] % 5)];
			//console.log('generateSalt wordArray: %s', wordArray);
			length = length < 8 ? 8 : length;
			//console.log('generateSalt length: %d', length);

			for (let i = 0, size; i < length / 8; i++) {
				_size = 0
				size = Math.round(Math.hypot(seed[i % 5], seed[(i + 1) % 5]));
				//console.log('generateSalt size: %d', size);
				let c = 2;
				for (let row = 0, cache = 0; row < 9; row++) {
					if (_size === 0) {
						_size = Math.pow(size, c);
						c++;
					}
					let vector = _size % wordArray.length;
					_size = Math.floor(_size / (10 * vector.toString().length));
					if (!cache) {
						cache = vector;
						vector=-1
					}
					text += vector > -1 ? wordArray[(cache + vector) % wordArray.length]:'';
				}
			}
		} catch (e) {
			text = '';
			console.log('generateSalt err: %s', e.message);
		}
		return text;
	}

	encrypt (msg, salt, times) {
		times = (times > 1000 && times != 0) ? 1000 : times;
		const utf8 = cryptoJS.enc.Utf8.parse(salt + msg).toString();
		let encrypted = cryptoJS.SHA3(utf8, {outputLength: this.lengths[salt.length % 3]}).toString();
		for (let i = 0; i < times; i++) {
			encrypted = cryptoJS.SHA3(encrypted, {outputLength: this.lengths[salt.length % 3]}).toString();
		}
		return cryptoJS.enc.Base64.stringify(cryptoJS.enc.Utf8.parse(salt+encrypted));
	}

	decrypt (msg, salt) {
		const decryption = cryptoJS.AES.decrypt(msg, salt);
		console.log('decrypt decryption: %s', decryption);
		return decryption.toString(cryptoJS.enc.Utf8);
	}

	encodePassword (email, password, seed, salt) {
		const times = Math.floor(Math.hypot(email.length, salt.length) * 59 % 500) + 1000;
		const encoded = this.encrypt(password, salt + email, times);
		return encoded
	}
};

export default EncryptionHelper;