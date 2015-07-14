var Connection = function(id, ws) {
	this.id = id;
	this.ws = ws;
	this.room_id;

	this.sendMessage = function(args) {
		this.ws.send(serialize(args));
	}

	this.channelToConnection;
	this.channelToRoom;

	var connectionCallback = function() {};

	this.onMessage = function(cb) {
		connectionCallback = cb;
	};

	this.onClose = function(cb) {
		ws.on('close', function() {
			console.log('closing');
			// this.disconnect(this.id);
			this.channelToRoom.sendMessage({
				event: 'close',
				data: {
					id: this.id
				}
			})
		}.bind(this));
	};

	this.ws.on('message', function(message) {
		var msg = deserialize(message);
		connectionCallback(msg);
	}.bind(this));
}

Connection.prototype.receiveMessage = function(args) {

}

Connection.prototype.disconnect = function(event) {
	// this.sendMessage(event)

}

function deserialize(message) {
	return JSON.parse(message)
}

function serialize(data) {
	return JSON.stringify(data);
}

module.exports = Connection;