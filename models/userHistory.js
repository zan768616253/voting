import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserHistorySchema = new Schema({
	email: {
		type: String,
		trim: true,
		required: true,
		match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
	},
	type: {
		type: String,
		enum: ['password']
	},
	time: {
		type: Number,
		default: 1
	},
	data: {
		type: String,
		trim: true,
		required: true
	}
});

UserHistorySchema.index({ email: 1, type: 1 });

UserHistorySchema.pre('save', function (next) {
	console.log('UserHistorySchema.pre this: %s', this);
	const email = this.email;
	const type = this.type;

	const query = mongoose.model('UserHistory').findOne({ email: email, type: type }).sort('-time').select('time');
	query.exec((err, item) => {
		if (err) {
			console.log('UserHistorySchema.pre save err: %s', err.message);
			next(err);
		}

		if (item && item.time) {
			this.time = item.time + 1;
		}
		next()
	})
})

const UserHistory = mongoose.model('UserHistory', UserHistorySchema);

export default UserHistory;