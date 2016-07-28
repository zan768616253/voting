function dispatchError (dispatch, type, message, detail) {
	dispatch({
		type: type,
		status: 'ERROR',
		message: message,
		detail: detail
	})
}

export default {
	dispatchError: dispatchError
}