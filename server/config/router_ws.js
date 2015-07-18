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
		this.Lobby.waitingRoom(connection)
	}.bind(this));
}

function deserialize(message) {
	return JSON.parse(message)
}

function serialize(data) {
	return JSON.stringify(data);
}

module.exports = Router;