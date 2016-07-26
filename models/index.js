import mongoose from 'mongoose';
import config from '../configs';

mongoose.connect(config.db.url, (err) => {
	if(err) {
		console.error('connect to %s error: ', config.db.url, err.message);
		process.exit(1);
	}
});

import './face';
import './user';

const Face = mongoose.model('Face');
const User = mongoose.model('User');

const models = {
	Face: Face,
	User: User
};

export default models;