import Eventproxy from 'eventproxy';

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
				} else {
					resolve(true);
				}
			})
		})
	}

	getFacePair() {
		console.log('begin FaceHelper.getFacePair');
		const self = this;
		return new Promise((resolve, reject) => {
			const ep = new Eventproxy();

			ep.fail((err) => {
				console.log('FaceHelper.getFacePair err: ' + err.message);
				reject(err);
			});

			ep.all('item1', 'item2', (item1, item2) => {
				console.log('item1: ' + JSON.stringify(item1));
				console.log('item2: ' + JSON.stringify(item2));
				resolve([item1, item2]);
			});

			ep.once('length', (length) => {
				self.getFaceRandomly(length).then((face) => {
					ep.emit('item1', face);
				}).catch((err) => {
					ep.emit('error', err);
				});

				self.getFaceRandomly(length).then((face) => {
					ep.emit('item2', face);
				}).catch((err) => {
					ep.emit('error', err);
				});
			});

			self.getWholeLength().then((length) => {
				ep.emit('length', length);
			}).catch((err) => {
				ep.emit('error', err);
			});
		})
	}

	getFaceRandomly(length) {
		return new Promise((resolve, reject) => {
			const rand = Math.floor(Math.random() * length);
			console.log('length: ' + length);
			console.log('rand: ' + rand);
			models.Face.findOne().skip(rand).exec((err, face) => {
				if (err) {
					reject(new Error('FaceHelper.getFaceRandomly err: ' + err.message))
				} else {
					resolve(face);
				}
			})
		})
	}

	getWholeLength() {
		return new Promise((resolve, reject) => {
			models.Face.count((err, count) => {
				if (err) {
					reject(new Error('FaceHelper.getCollectionLength err: ' + err.message))
				} else {
					resolve(count);
				}
			})
		})
	}
}

export default FaceHelper;