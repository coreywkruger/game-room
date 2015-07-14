const controllers = require('./../app/controllers'),
	NSA = require('./../lib/nsa'),
	_ = require('underscore'),
	World = require('./../lib/world'),
	connection = require('./../lib/connection'),
	WSS = require('./../lib/wss');

var Router = function(ws) {

	var Rooms = {};
	var WebSocketServer = new WSS();
	var Lobby = new World.Lobby();

	for (var i = 0; i < Lobby.max_rooms; i++) {
		var new_room = new World.Room();
		Rooms[new_room.id] = new_room;
	}

	WebSocketServer.onConnection(function(conn) {
		console.log("new connection");
		conn.onMessage(function(message) {
			// console.log(message)
			if (conn.room_id == undefined) {
				if (message.event == "rooming" && message.data.room_id) {
					conn.room_id = message.data.room_id;
					if (Rooms[conn.room_id]) {
						Rooms[conn.room_id].assignUser(conn);
					}
				}

			} else {

			}
		});

		conn.sendMessage({
			event: "initialized",
			data: {
				rooms: _.keys(Rooms)
			},
			websocket_id: conn.id
		});

		conn.onClose(function(id) {

		});

		// connection.onMessage(function(message) {
		// 	console.log('message [ ' + connection.id + ' ] :', message)
		// 	 handle request 
		// 	// controllers.Authentication.websocket_auth(msg['api-key'], function(err, isAuthed) {

		// 	// });
		// });
	});


}

Router.prototype.assign_room = function(room_id, user_websocket_id, user_id) {
	if (_.size(this.rooms[room_id]) < this.room_max_capacity) {
		this.rooms[room_id].users[user_websocket_id] = user_id;
		this.rooms[room_id].sim.addAgent(this.rooms[room_id].users[websocket_id]);
	}
}

Router.prototype.create_room = function() {
	if (_.size(this.rooms) < this.max_num_rooms) {
		var room_id = 'rid_' + NSA.random(25);
		this.rooms[room_id] = {};
		this.rooms[room_id].sim = Sim.create();
	}
}

Router.prototype.delete_room = function(room_id) {
	if (this.rooms[room_id]) {
		this.rooms[room_id].sim.destroy();
		this.disconnect(this.rooms[room_id].users);
		delete this.rooms[room_id];
	}
}

Router.prototype.sim_tick = function() {
	for (var room_id in this.rooms) {
		var tick_data = this.rooms[room_id].sim.tick();
		this.broadcast(tick_data);
	}
}

Router.prototype.broadcast = function(user_ids) {
	user_ids.forEach(user_ids, function(user) {
		this.users
	});
}


function deserialize(message) {
	return JSON.parse(message)
}

function serialize(data) {
	return JSON.stringify(data);
}

module.exports = Router;