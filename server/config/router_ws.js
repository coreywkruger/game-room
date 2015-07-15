const controllers = require('./../app/controllers'),
	NSA = require('./../lib/nsa'),
	_ = require('underscore'),
	World = require('./../lib/world'),
	WSS = require('./../lib/wss');

var Router = function(ws) {

	var Rooms = {};
	var WebSocketServer = new WSS();
	var Lobby = new World.Lobby();

	for (var i = 0; i < Lobby.max_rooms; i++) {
		var new_room = new World.Room();
		Rooms[new_room.id] = new_room;
	}

	WebSocketServer.onConnection(function(connection) {
		console.log("new connection: ", connection.id);
		connection.onMessage(function(message) {

			if (connection.room_id == undefined) {

				if (message.event == "rooming" && message.data.room_id) {
					connection.room_id = message.data.room_id;
					if (Rooms[connection.room_id]) {
						Rooms[connection.room_id].assignUser(connection);
					}
				}

			} else {

			}
		});

		connection.sendMessage({
			event: "initialized",
			data: {
				rooms: _.keys(Rooms)
			},
			websocket_id: connection.id
		});
	});
}

function deserialize(message) {
	return JSON.parse(message)
}

function serialize(data) {
	return JSON.stringify(data);
}

module.exports = Router;