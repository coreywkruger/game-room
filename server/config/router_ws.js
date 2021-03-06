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
		connection.onRoomChoice(function(room_id) {
			console.log("onRoomChoice", room_id);
			if (this.Lobby.rooms[room_id]) {
				this.Lobby.rooms[room_id].assignUser(connection);
			} else {
				connection.sendMessage({
					event: "room_not_found"
				});
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