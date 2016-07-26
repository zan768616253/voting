import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		trim: true,
		index: { unique: true },
		required: [true, 'Email is required'],
		validate: [validateEmail, 'Email is invalid'],
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email is invalid'],

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
	}
});

const validateEmail = function (email) {
	const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return reg.test(email);
}

const User = mongoose.model('User', userSchema);

export default User;