import Server from 'socket.io';

export default function startServer(store) {
	const io = Server(8090);
	console.log('8090 is attached');

	store.subscribe(
		() => {
			io.emit('state', store.getState().toJS());
		}
	)

	io.on('connection', (socket) => {
		console.log('connected: ' + socket.id);
		socket.emit('state', store.getState().toJS());
		socket.on('action', store.dispatch.bind(store));

		socket.on('action', (message) => {
			console.log('action message: ' + JSON.stringify(message));
		})
	});
}