import thunk from 'redux-thunk';

import { expect } from 'chai';
import { applyMiddleware } from 'redux';

const middlewares = [ thunk ];

function mockStore(done) {
	function mockStoreWithoutMiddleware () {
		return {
			dispatch(action) {
				console.log('mockStore.mockStoreWithoutMiddleware.dispatch action: %s', JSON.stringify(action));

				try {
					console.log('mockStore.mockStoreWithoutMiddleware.dispatch action.status === COMPLETED: %s', action.status === 'COMPLETED');
					expect(action.status).to.be.eql('COMPLETED');
					done();
				} catch (err) {
					expect(err).to.be.undefined;
					done(e)
				}
			}
		}
	}

	const mockStoreWithMiddleware = applyMiddleware(
		...middlewares
	)(mockStoreWithoutMiddleware);

	return mockStoreWithMiddleware();
}

export default {
	mockStore: mockStore
}