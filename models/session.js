import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
	session: {
		type: String,
		trim: true,
		required: true,
		index: { unique: true }
	},
	email: {
		type: String,
		trim: true,
		required: true,
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email is invalid']
	},
	device: {
		type: String,
		trim: true,
		required: true
	},
	ip: {
		type: String,
		trim: true,
		required: true
	}
});

sessionSchema.index({ email:1, device: 1, ip: 1 }, { unqiue: true });

const Session = mongoose.model('Session', sessionSchema);

export default Session;