import makeStore from './src/store';
import startServer from './src/server';
import { setEntries } from './src/actions';
import models from './models';

export const store = makeStore();

startServer(store);

setEntries();