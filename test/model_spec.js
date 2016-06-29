import format from 'string-template';
import Eventproxy from 'eventproxy';

import { expect } from 'chai';

import models from '../models';

describe('db connection test', () => {
	describe('add face data', () => {
		before(() => {
		});

		let _id;

		it('add face data', (done) => {
			const now = Date.now();

			const item = {
				content: format('I m a {timestamp} content test', { timestamp: now }),
				description: format('I m a {timestamp} description test', { timestamp: now })
			};

			models.Face.create(item, (err, face) => {
				expect(face).to.be.ok;
				_id = face._id;
				done();
			})
		});

		it('get face data', () => {
			const ep = new Eventproxy();
			ep.fail((err) => {
				console.log('err: ' + err.message);
				expect(err).to.not.be.ok;
				done();
			});
			ep.all('find', 'findOne', (find, findOne) => {
				expect(findOne).to.be.ok;
				expect(find).to.be.ok;
				expect(find.length).to.be.above(0);
			});
			const query_find = models.Face.find({ '_id': _id });
			query_find.exec((err, faces) => {
				if (err) {
					ep.emit('error', new Error('find err: ' + err.message));
				} else {
					console.log('find: ' + faces.toString());
					ep.emit('find', faces);
				}
			})

			const query_findOne = models.Face.findOne({ '_id': _id });
			query_findOne.exec((err, face) => {
				if (err) {
					ep.emit('error', new Error('findOne err: ' + err.message));
				} else {
					console.log('findOne: ' + JSON.stringify(face));
					ep.emit('findOne', face);
				}
			})
		});
	})
})