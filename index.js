import makeStore from './src/store';
import startServer from './src/server';
import models from './models';

export const store = makeStore();

startServer(store);

store.dispatch({
	type: 'SET_ENTRIES'
});