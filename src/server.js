import Server from 'socket.io';

import * as actions from './actions';

import AuthenticateHelper from '../helpers/helper_authenticate'

export default function startServer(store) {
	const io = Server(8090);
	const authenticateHelper = new AuthenticateHelper();

	console.log('8090 is attached');

	store.subscribe(
		() => {
			console.log('store.subscribe last action: ' + store.getState().get('action'));
			console.log('store.subscribe state: ' + JSON.stringify(store.getState().toJS()));
			const action_type = store.getState().get('action');
			io.emit(action_type, store.getState().toJS());
		}
	);

	io.use((socket, next) => {
		console.log('I m callback function for using socket io');

		const headers = socket.request.headers;
		const cookie = headers.cookie;
		const cookies = authenticateHelper.processCookie(cookie);
		const seed = cookies['seed'];
		const mf_auth = cookies['mf_auth'];

		console.log('io.use.before authenticateHelper.checkAuth');
		authenticateHelper.checkAuth(seed, mf_auth).then(session => {
			console.log('io.use.after authenticateHelper.checkAuth get session: ' + session);
			if (session) {
				next();
			} else {
				next(new Error('Authentication error'));
			}
		}).catch(err => {
			console.log('io.use.after authenticateHelper.checkAuth get error: ' + err.message);
			next(new Error('Authentication error'));
		})
	})

	io.on('connection', (socket) => {
		console.log('connection socket id: ' + socket.id);

		socket.on('action', (action) => {
			handle_action_unauthed(action, store.dispatch, socket.handshake);
		});
	});
}

function handle_action_unauthed(action, dispatch, handshake) {
	if (action && action.meta && action.meta.remote && action.token) {
		switch (action.type) {
			case 'USER_CREATE':
				const create_user_Info = action.value;
				console.log('USER_CREATE.action: ' + JSON.stringify(action));
				dispatch(actions.createUser(create_user_Info.email, create_user_Info.password, create_user_Info.name, action.seed.split(',')));
				break;
			case 'USER_LOGIN':
				const login_user_Info = action.value;
				console.log('USER_LOGIN.action: ' + JSON.stringify(action));
				const ip = handshake.headers.host;
				const device = handshake.headers['user-agent'];
				dispatch(actions.login(login_user_Info.email, login_user_Info.password, action.seed.split(','), device, ip));
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