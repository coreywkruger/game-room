// const M = require('./messages');

var Connection = function(id, ws) {

	this.id = id;
	this.ws = ws;
	this.room_id;
	this.message_buffer = [];
	this.channelToConnection;
	this.channelToRoom;
	this.assigned = false;

	console.log("New Connection: ", this.id);

	this.ws.on('message', function(message) {

		var msg = deserialize(message);
		console.log('Conn Received Message:', msg.event);

		if (msg.event == "rooming" && this.room_id == undefined) {
			this.room_id = msg.data.room_id;
		}

		if (this.channelToRoom) {
			this.channelToRoom.sendMessage(msg);
		}
	}.bind(this));

	var loop = function() {
		if (this.message_buffer.length > 0) {
			var msg = this.popMessage();
			console.log("Conn Sending Message: ", msg.event);
			this.ws.send(serialize(msg));
		}
	}.bind(this);

	setInterval(loop, 1);

	this.ws.on('close', function() {
		console.log("Connection Closed: ", this.id);
		// this.disconnect(this.id);
		if (this.room_id) {
			this.channelToRoom.sendMessage({
				event: 'excuse_me',
				data: {
					id: this.id
				}
			});
		}
		clearInterval(loop);
	}.bind(this));

	this.receiveMessage = function(args) {
		this.message_buffer.push(args);
	}.bind(this);

	this.popMessage = function() {
		var msg = this.message_buffer.pop();
		return msg;
	}
}

function deserialize(message) {
	return JSON.parse(message)
}

function serialize(data) {
	return JSON.stringify(data);
}

module.exports = Connection;