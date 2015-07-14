var NSA = require('./nsa');
var errors = require('./errors');
var base64URL = require('base64-url');

var createUser = function(user_id, cb) {
	return create('user', {
		'user_id': user_id
	}, cb);
}

var validateUser = function(data, cb) {
	validateRaw(data, function(err, token) {
		if (err) {
			return cb(err);
		}
		cb(null, token);
	});
}

var create = function(scheme, authReq, cb) {

	// lockin timestamp
	var timestamp = Math.floor(Date.now() / 1000);

	timestamp = timestamp; // + expiresAt;

	// create Token Object
	//user_id: user_id,
	var token = {
		timestamp: timestamp,
		user_id: authReq.user_id
	}

	// Create Hash (prevent manipulation)
	token.hash = NSA.hashSession(
		token.user_id + '-' +
		timestamp
	);

	// JSONify
	var json = JSON.stringify(token);
	if (!json) {
		return cb(new errors.AuthenticationError("Server Error: Invalid JSON"));
	}

	// Encrypt
	var session_key = NSA.encryptSession(json);
	if (!session_key) {
		return cb(new errors.AuthenticationError("Server Error: Invalid Session Created"));
	}

	// ANdddd return
	return cb(null, session_key);
};

var validateRaw = function(data, cb) {

	// valid "data"
	if (!data) {
		return cb(new errors.AuthenticationError("Invalid Session given"));
	}

	// Valid Encrypted Session
	var json = NSA.decryptSession(data);
	if (!json) {
		return cb(new errors.AuthenticationError("Invalid Session"));
	}

	try {
		var token = JSON.parse(json);
	} catch (err) {
		var token = undefined;
	}


	// Valid JSON?
	if (!token) {
		return cb(new errors.AuthenticationError("Invalid Session."));
	} else if (!token.user_id || !token.timestamp || !token.hash) {
		return cb(new errors.AuthenticationError("Invalid Session.."));
	}


	// Validate Time
	// var time = Math.floor(Date.now() / 1000);
	// if (time > token.timestamp) { // Older then 30 minutes
	// 	return cb(new errors.AuthenticationError("Expired Session."));
	// }

	// Validate Hash
	var computedHash = NSA.hashSession(
		token.user_id + '-' +
		token.timestamp
	);
	if (token.hash != computedHash) { // Manipulated
		console.log(token);
		console.log(computedHash);
		console.log(token.hash);
		return cb(new errors.AuthenticationError("UnAuthenticated Session!"));
	}

	// Return the Client Id
	return cb(null, token);
};


module.exports = {
	create: create,
	createUser: createUser,

	validateRaw: validateRaw,
	validateUser: validateUser
};