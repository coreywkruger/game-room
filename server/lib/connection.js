var Connection = function(id, ws) {
	this.id = id;
	this.ws = ws;
	this.room_id;
	this.message_buffer = [];

	this.sendMessage = function(args) {
		self.message_buffer.push(args);
	}

	this.transmitMessage = function(args) {
		this.ws.send(serialize(args));
	}

	setInterval(function() {
		if (self.message_buffer.length > 0) {
			var msg = self.popMessage();
			self.transmitMessage(msg);
		}
	}.bind(this), 1);

	this.channelToConnection;
	this.channelToRoom;

	var self = this;
	this.popMessage = function() {
		var msg = self.message_buffer.pop();
		return msg;
	}

	var connectionCallback = function() {};

	this.onMessage = function(cb) {
		connectionCallback = cb;
	};

	this.onClose = function(cb) {
		ws.on('close', function() {
			console.log('closing:', this.id);
			// this.disconnect(this.id);
			this.channelToRoom.sendMessage({
				event: 'close',
				data: {
					id: this.id
				}
			})
		}.bind(this));
	}.bind(this);

	this.ws.on('message', function(message) {
		console.log('message:', message);
		var msg = deserialize(message);
		connectionCallback(msg);
	}.bind(this));
	this.onClose(function() {
		console.log('closed');
	});
}

Connection.prototype.receiveMessage = function(args) {

}

Connection.prototype.disconnect = function(event) {
	// this.sendMessage(event)
	// this.onClose(function() {
	// 	console.log('closed');
	// });
}

function deserialize(message) {
	return JSON.parse(message)
}

function serialize(data) {
	return JSON.stringify(data);
}

module.exports = Connection;