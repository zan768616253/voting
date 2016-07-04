import helpers from '../helpers';

const faceHelper = new helpers.FaceHelper();

export const SET_ENTRIES = 'SET_ENTRIES';
export function setEntries() {
	return function(dispatch) {
		faceHelper.getFacePair().then((pair) => {
			dispatch({ type: 'SET_ENTRIES', status: 'COMPLETED',  pair: pair});
		}).catch((err) => {
			dispatch({ type: 'SET_ENTRIES', status: 'ERROR', });
		})
	}
}