const Sim = require('./../src/sim'),
	// User = require('./../src/user'),
	NSA = require('./nsa'),
	Connection = require('./connection'),
	// Channel = require('./channel'),
	// M = require('./../lib/messages'),
	_ = require('underscore');

var Room = function() {

	this.id = 'rid_' + NSA.random(10);
	this.users = {};
	this.max_users = 10;
	this.Sim = new Sim(this.id);
	this.Sim.onUpdate(function() {
		this.broadcast({
			event: "scene_updated",
			data: {
				agents: this.Sim.getAgents()
			}
		});
	}.bind(this));

	this.broadcast = function(msg) {
		for (var u in this.users) {
			this.users[u].sendMessage(msg);
		}
	};

	this.assignUser = function(connection) {
		if (_.size(this.users) < this.max_users) {
			if (this.users[connection.id] == undefined) {

				this.users[connection.id] = connection;
				this.users[connection.id].onMessage(function(msg) {
					console.log('Received Message: ', msg.event);
					if (msg.event == "disconnect") {
						this.removeUser(msg.data.id);
					} else if (msg.event == "translate") {
						this.Sim.translateAgent(msg.websocket_id, msg.data.x, msg.data.y, msg.data.z);
					} else if (msg.event == "rotate") {
						this.Sim.translateAgent(msg.websocket_id, msg.data.x, msg.data.y, msg.data.z);
					} else if (msg.event == "excuse_me") {
						this.removeUser(msg.data.id);
					} else if (msg.event == "scene_load") {
						this.users[msg.websocket_id].sendMessage({
							event: "scene_load",
							data: {
								agents: this.Sim.getAgents()
							},
							websocket_id: msg.websocket_id
						});
					}
				}.bind(this));

				this.users[connection.id].sendMessage({
					event: "room_selected",
					data: {
						room_id: connection.room_id
					},
					websocket_id: connection.id
				});
				this.Sim.addAgent(connection.id);
				console.log("Users in Room: ..." + this.id.slice(-5), _.keys(this.users));
				return this.users[connection.id];
			}
		}
	}

	this.removeUser = function(id, reason) {
		if (this.users[id]) {
			this.Sim.removeAgent(id);
			this.users[id].ws.close();
			delete this.users[id];
			return id;
		} else {
			return null;
		}
	}
}

Room.prototype.getUser = function(id) {
	if (this.users[id]) {
		return this.users[id];
	} else {
		return null;
	}
}

Room.prototype.close = function(reason) {
	var num_users = _.size(this.users);
	if (num_users > 0) {
		for (var key in this.users) {
			this.users[key].disconnect(reason);
		}
	}
	this.users = {};
	return num_users;
}

var Lobby = function() {
	this.id = 'lid_' + NSA.random(10);
	this.max_rooms = 10;
	this.rooms = {};
}

Lobby.prototype.addRoom = function(room) {
	if (_.size(this.rooms) < this.max_rooms) {
		this.rooms[room.id] = room;
		return this.rooms[room.id];
	} else {
		return null;
	}
};

Lobby.prototype.getRoom = function(room_id) {
	return this.rooms[room_id];
}

Lobby.prototype.deleteRoom = function(id, reason) {
	var num_rooms = _.size(this.rooms);
	if (num_rooms > 0) {
		if (this.rooms[id]) {
			this.rooms[id].close(reason);
		}
	}
	return num_rooms;
};

module.exports = {
	Room: Room,
	Lobby: Lobby
};