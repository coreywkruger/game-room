const controllers = require('./../app/controllers'),
	NSA = require('./../lib/nsa'),
	_ = require('underscore'),
	World = require('./../lib/world'),
	WSS = require('./../lib/wss');

var Router = function(ws) {

	var Rooms = {};
	var WebSocketServer = new WSS();
	this.Lobby = new World.Lobby();

	for (var i = 0; i < this.Lobby.max_rooms; i++) {
		this.Lobby.addRoom(new World.Room());
	}

	WebSocketServer.onConnection(function(connection) {
		console.log("new connection: ", connection.id);
		connection.initMessage(function(message) {
			// console.log(message);
			if (connection.room_id == undefined) {

				if (message.event == "rooming" && message.data.room_id) {
					connection.room_id = message.data.room_id;
					if (this.Lobby.getRoom(connection.room_id)) {
						this.Lobby.getRoom(connection.room_id).assignUser(connection);
						connection.channelToConnection.sendMessage({
							event: "room_selected",
							data: {
								room_id: connection.room_id
							},
							websocket_id: connection.id
						})
					}
				} else {
					connection.ws.send(serialize({
						event: "initialized",
						data: {},
						websocket_id: connection.id
					}));
				}
			}
		}.bind(this));
	}.bind(this));
}

function deserialize(message) {
	return JSON.parse(message)
}

function serialize(data) {
	return JSON.stringify(data);
}

module.exports = Router;