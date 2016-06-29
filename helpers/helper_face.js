import models from '../models';

class FaceHelper {
	constructor() {
	}

	vote(_id) {
		return new Promise((resolve, reject) => {
			models.Face.update({
				_id: _id
			}, {
				$inc: { 'vote': 1 }
			}, (err, rows) => {
				if (err) {
					reject(new Error('FaceHelper.vote err: ' + err.message))
				}
				resolve(true);
			})
		})
	}
}

export default FaceHelper;