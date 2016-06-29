import mongoose from 'mongoose';
import config from '../configs';

mongoose.connect(config.db.url, (err) => {
	if(err) {
		console.error('connect to %s error: ', config.db.url, err.message);
		process.exit(1);
	}
});

import './face';

const Face = mongoose.model('Face');

const models = {
	Face: Face
};

export default models;