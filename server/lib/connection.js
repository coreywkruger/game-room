var Connection = function(id, ws) {
	this.id = id;
	this.ws = ws;
	this.room_id;
	this.message_buffer = [];

	this.receiveMessage = function(args) {
		this.message_buffer.push(args);
	}.bind(this);

	setInterval(function() {
		if (self.message_buffer.length > 0) {
			var msg = this.popMessage();
			this.ws.send(serialize(msg));
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

	this.initMessage = function(cb) {
		connectionCallback = cb;
	};

	this.onClose = function(cb) {
		ws.on('close', function() {
			console.log('closing:', this.id);
			// this.disconnect(this.id);
			if (this.room_id) {
				this.channelToRoom.sendMessage({
					event: 'close',
					data: {
						id: this.id
					}
				})
			}
		}.bind(this));
	}.bind(this);

	this.ws.on('message', function(message) {
		// console.log('message:', this.room_id);
		var msg = deserialize(message);

		if (this.room_id == undefined) {
			return connectionCallback(msg);
		}

		if (this.channelToRoom) {
			this.channelToRoom.sendMessage(msg);
		}
	}.bind(this));

	this.onClose(function() {
		console.log('closed');
	});
}

function deserialize(message) {
	return JSON.parse(message)
}

function serialize(data) {
	return JSON.stringify(data);
}

module.exports = Connection;