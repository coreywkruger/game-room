const Sim = require('./../src/sim'),
	// User = require('./../src/user'),
	NSA = require('./nsa'),
	Connection = require('./connection'),
	Channel = require('./channel'),
	_ = require('underscore');

var Room = function() {

	this.id = 'lid_' + NSA.random(25);
	this.users = {};
	this.max_users = 10;

	var _sim = new Sim();
	var messageHandler = function(id, args) {
		this.users[id].sendMessage(args);
	}.bind(this);

	var receiveMessage = function(msg) {
		if (msg.event == "close") {
			this.removeUser(msg.data.id);
		} else {

		}
	}.bind(this);

	this.assignUser = function(connection) {
		if (_.size(this.users) < this.max_users) {
			if (this.users[connection.id] == undefined) {

				this.users[connection.id] = connection;

				_sim.addAgent(connection.id);

				connection.channelToConnection = new Channel(messageHandler);
				connection.channelToRoom = new Channel(receiveMessage);
				console.log(_.keys(this.users));
				return this.users[connection.id];
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	this.excuseUser = function(id, reason) {
		if (this.users[id]) {
			this.users[id].disconnect(reason);
			return this.removeUser(this.users[id]);
		} else {
			return null;
		}
	}

	this.removeUser = function(id, reason) {
		if (this.users[id]) {
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
	this.id = 'lid_' + NSA.random(25);
	this.max_rooms = 10;
	this.rooms = {};
}

Lobby.prototype.addRoom = function() {
	if (_.size(this.rooms) < this.max_rooms) {
		var room_id = 'rid_' + NSA.random(25);
		this.rooms[room_id] = new Room(room_id);
		return this.rooms[room_id];
	} else {
		return null;
	}
};

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