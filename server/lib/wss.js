const Sim = require('./../src/sim'),
	User = require('./../src/user'),
	Connection = require('./connection'),
	Web = require('ws'),
	WebSocket = require('ws'),
	NSA = require('./nsa'),
	_ = require('underscore');

var WSS = function() {

	this.id = 'wssid_' + NSA.random(10);

	this.server = new WebSocket.Server({
		// path: "/" + this.id,
		port: 3334
	});
	this.connections = {};

	var connectionCallback = function(msg) {};

	this.onConnection = function(cb) {
		connectionCallback = cb;
	};

	this.server.on('connection', function connection(ws) {
		var connection_id = 'cid_' + NSA.random(25);
		var new_connection = new Connection(connection_id, ws);

		this.connections[connection_id] = new_connection;
		connectionCallback(new_connection);
	}.bind(this));
}

module.exports = WSS;