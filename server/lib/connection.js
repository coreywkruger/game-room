// const M = require('./messages');

var Connection = function(id, ws) {

	this.id = id;
	this.ws = ws;
	this.room_id;
	this.message_buffer = [];
	this.assigned = false;

	console.log("New Connection: ", this.id);

	var _onMessage = function() {};

	this.ws.on('message', function(message) {

		var msg = deserialize(message);
		console.log('Conn Received Message:', msg.event);

		if (msg.event == "rooming" && this.room_id == undefined) {
			this.room_id = msg.data.room_id;
			_onRoomChoice(this.room_id);
		}

		if (_onMessage) {
			_onMessage(msg);
		}
	}.bind(this));

	this.ws.on('close', function() {
		console.log("Connection Closed: ", this.id);
		// this.disconnect(this.id);
		if (this.room_id) {
			_onMessage({
				event: 'excuse_me',
				data: {
					id: this.id
				}
			});
		}
	}.bind(this));

	this.onMessage = function(cb) {
		_onMessage = cb;
	}

	this.onRoomChoice = function(cb) {
		_onRoomChoice = cb;
	}

	this.sendMessage = function(msg) {
		this.ws.send(serialize(msg));
	}.bind(this);
}

function deserialize(message) {
	return JSON.parse(message)
}

function serialize(data) {
	return JSON.stringify(data);
}

module.exports = Connection;