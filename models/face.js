import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const faceSchema = new Schema({
	content: { type: String, required: true },
	description: String,
	vote: { type: Number, default: 0  }
});

const Face = mongoose.model('Face', faceSchema);

export default Face;