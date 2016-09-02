import Server from 'socket.io';

import * as actions from './actions';

export default function startServer(store) {
	const io = Server(8090);
	console.log('8090 is attached');

	store.subscribe(
		() => {
			//console.log('store.subscribe state: ' + JSON.stringify(store.getState().toJS()));
			//io.emit('votees', store.getState().toJS());
		}
	);

	io.use((socket, next) => {
		//console.log('I m callback function for using socket io');
		if (socket.request.headers.cookie)
			return next();
		next(new Error('Authentication error'));
	})

	io.on('connection', (socket) => {
		console.log('connection socket id: ' + socket.id);
		//socket.emit('votees', store.getState().toJS());
		socket.on('action', (action) => {
			handle_action_unauthed(action, store.dispatch, socket.handshake);
		});
	});
}

function handle_action_unauthed(action, dispatch) {
	if (action && action.meta && action.meta.remote && action.token) {
		switch (action.type) {
			case 'USER_CREATE':
				const create_user_Info = action.value;
				console.log('USER_CREATE.action: ' + JSON.stringify(action));
				dispatch(actions.createUser(create_user_Info.email, create_user_Info.password, create_user_Info.name, action.seed));
				break;
			case 'USER_LOGIN':
				const login_user_Info = action.value;

				break;
			default:
				console.log('handle default action');
				break;
		}
	} else {
		console.log('action info is not enough');
	}
}

function handle_action_authed(action, dispatch) {
	if (action && action.meta && action.meta.remote) {
		switch (action.type) {
			case 'VOTE':
				dispatch(actions.vote(action.id));
				break;
		}
	} else {
		console.log('action info is not enough');
	}
}