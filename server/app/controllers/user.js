const config = require('./../../config/config.json'),
	isValid = require('./../../lib/is_valid'),
	errors = require('./../../lib/errors'),
	models = require('./../models');

var Client = {
	create: function(cb) {
		var email = this.params.email,
			password = this.params.password;

		if (email == undefined || password == undefined) {
			return cb(new errors.InvalidRequestError('Arguments Missing'));
		}

		if (!isValid.validEmail(email)) {
			return cb(new errors.InvalidRequestError('Invalid email'));
		}

		// Check if Email is in DB
		models.Client.findOne({
			"email": email
		}, function(err, client) {
			if (err) {
				return cb(new errors.DatabaseError('Could not find client', err));
			}
			if (client) {
				return cb(new errors.DuplicateError('Email: "' + email + '" already registered'));
			}

			// CREATE new USER
			var client = new models.Client({
				email: email,
				password: password
			});

			client.save(function(err) {
				if (err) {
					return cb(err);
				}
				cb(null, client);
			});
		});
	}
};

module.exports = Client;