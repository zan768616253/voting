import Server from 'socket.io';

import * as actions from './actions';

export default function startServer(store) {
	const io = Server(8090);
	console.log('8090 is attached');

	store.subscribe(
		() => {
			console.log('store.subscribe state: ' + JSON.stringify(store.getState().toJS()));
			io.emit('state', store.getState().toJS());
		}
	);

	io.on('connection', (socket) => {
		console.log('connection socket id: ' + socket.id);
		socket.emit('state', store.getState().toJS());
		socket.on('action', (action) => {
			handle_action(action, store.dispatch);
		});
	});
}

function handle_action(action, dispatch) {
	if (action && action.meta && action.meta.remote) {
		switch (action.type) {
			case 'VOTE':
				dispatch(actions.vote(action.id));
				break;
			default:
				console.log('handle default action');
				break;
		}
	} else {
		console.log('action info is not enough');
	}
}