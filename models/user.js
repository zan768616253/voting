import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		trim: true,
		index: { unique: true },
		required: [true, 'Email is required'],
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email is invalid']
	},
	password: {
		type: String,
		required: [true, 'Email is required'],
	},
	name: {
		type: String,
		required: [true, 'Name is required']
	},
	salt: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	}
});

const User = mongoose.model('User', userSchema);

export default User;