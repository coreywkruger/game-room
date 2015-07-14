const mongoose = require('mongoose');
const config = require('./config');

var Mongo = function() {
	this.databaseURI = this.getURI();
	if (!this.databaseURI) {
		return process.exit(1);
	}
};

Mongo.prototype.connect = function(cb) {
	mongoose.connection.on('error', function(err) {
		console.log('[DB] Error. Mongo connection interrupted: ' + err);
		throw new Error('[DB] Mongo connection interrupted: ' + err);
	});

	mongoose.connection.on('disconnected', function() {
		console.log('[DB] Mongo disconnected.');
	});

	mongoose.connect(this.databaseURI, function(err, db) {
		if (err) {
			console.log('[DB] Error. Failed to initialize database: ' + err);
			return cb(err);
		}
		console.log('[DB] Initialized: ' + this.databaseURI);
		cb();
	}.bind(this));
};

Mongo.prototype.getURI = function() {

	// Does "DB" exist
	if (!config.database) {
		console.log('EMPTY DATABASE CONFIG');
		return false;
	}

	return 'mongodb://' +
		config.database.host + '/' +
		config.database.name;

};

module.exports = {
	Mongo: Mongo
};