const config = require('./../../config/config.json'),
	isValid = require('./../../lib/is_valid'),
	errors = require('./../../lib/errors'),
	models = require('./../models');

var User = {
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
		models.User.findOne({
			"email": email
		}, function(err, user) {
			if (err) {
				return cb(new errors.DatabaseError('Could not find user', err));
			}
			if (user) {
				return cb(new errors.DuplicateError('Email: "' + email + '" already registered'));
			}

			// CREATE new USER
			var user = new models.User({
				email: email,
				password: password
			});

			user.save(function(err) {
				if (err) {
					return cb(err);
				}
				cb(null, user);
			});
		});
	}
};

module.exports = User;