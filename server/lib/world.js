const SimSrc = require('./../src/sim'),
	NSA = require('./nsa'),
	Connection = require('./connection'),
	roomController = require('../app/controllers/room'),
	_ = require('underscore');

var Room = function() {

	this.id = 'rid_' + NSA.random(10);
	this.users = {};
	this.max_users = 10;
	this.Sim = new SimSrc(this);

	var messageHandler = function(msg) {
		if (roomController[msg.event]) {
			roomController[msg.event](this, msg);
		}
	}.bind(this);

	this.assignUser = function(connection) {
		if (_.size(this.users) < this.max_users) {
			if (this.users[connection.id] == undefined) {

				this.users[connection.id] = connection;
				this.users[connection.id].onMessage(messageHandler);
				this.users[connection.id].sendMessage({
					event: "room_selected",
					websocket_id: connection.id,
					data: {
						room_id: connection.room_id
					}
				});
				this.Sim.addAgent(connection.id);
				console.log("Users in Room: ..." + this.id.slice(-5), _.keys(this.users));
				return this.users[connection.id];
			}
		}
	}
}

Room.prototype.removeUser = function(id, reason) {
	if (this.users[id]) {
		this.Sim.removeAgent(id);
		this.users[id].ws.close();
		delete this.users[id];
		return id;
	} else {
		return null;
	}
}

Room.prototype.broadcast = function(msg) {
	for (var u in this.users) {
		this.users[u].sendMessage(msg);
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
	this.max_rooms = 5;
	this.rooms = {};

	setInterval(function() {
		for (var key in this.rooms) {
			console.log("Room: ", key, "->", _.keys(this.rooms[key].users));
		}
	}.bind(this), 2000);
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