const config = require('../../config/config.json'),
	errors = require('./../../lib/errors'),
	models = require('../models');

var Authentication = {
	login: function(cb) {

		models.User.findOne({
			"email": this.params.email,
		}, function(err, user) {

			if (err) {
				return cb(new errors.DatabaseError('Could not sign in'));
			}

			if (user == null) {
				return cb(new errors.AuthenticationError('Could not sign in.'));
			}

			user.comparePassword(this.params.password, function(err, isMatch) {

				if (err) {
					return cb(new errors.AuthenticationError('Could not sign in..')); // Error comparing password
				}

				if (!isMatch) {
					return cb(new errors.AuthenticationError('Could not sign in...')); // Incorrect password
				}

				Session.createUser(user._id.toString(), function(err, session_key) {

					if (err) {
						return cb(new errors.AuthenticationError('Could not sign in....')); // Error creating session
					}

					cb(null, {
						"session-key": session_key
					});
				});

			}.bind(this));
		}.bind(this));
	},

	websocket_auth: function(api_key, cb) {

		Session.validateUser(api_key, function(err, token) {
			if (err) {
				return cb(new errors.AuthenticationError("Could not authenticate request."));
			}
			cb(null, token);
		});
	},

	// websocket_auth: function(cb) {

	// 	var socketId = this.params.socketId;
	// 	var requestChannel = this.params.channel;
	// 	var authedChannel = "private-" + config.get('APP_ENV') + '-' + this.session.user.id;
	// 	console.log('this.params', this.params, requestChannel, authedChannel)
	// 	// Respond with Auth
	// 	if (requestChannel == authedChannel) {
	// 		var auth_req = websocket.authenticate(socketId, authedChannel);
	// 		console.log(auth_req)
	// 		return cb(null, auth_req);
	// 	} else {
	// 		return cb(new errors.ApiError("Invalid Channel Authentication"));
	// 	}

	// },

	forgot: function(cb) {
		//console.log('this.params', this.params)
		// models.Client.findOne({
		// 	"email": this.params.email,
		// }, function(err, client) {

		// 	if (err) {
		// 		return cb(new errors.NotFoundError('Could not find client'));
		// 	}

		// 	if (client == null) {
		// 		return cb(new errors.AuthenticationError('Could not find client.'));
		// 	}

		// 	client.forgot_token = nsa.randomAsciiString(256);
		// 	client.forgot_timestamp = Math.floor(new Date() / 1000);

		// 	client.save(function(err, res) {
		// 		var reset_url = "https://gobold.com";
		// 		var reset_path = "#/public/reset-password/" + client.forgot_token;

		// 		// TODO : THIS SHOULD BE CONFIG BASED NOT HARDCODED
		// 		// production
		// 		if (config.get('NODE_ENV') == "production") {
		// 			reset_url = "https://pay.gobold.com";
		// 			if (config.get('APP_ENV') == "sandbox") {
		// 				reset_url = "https://sandbox.gobold.com";
		// 			}
		// 		} else if (config.get('NODE_ENV') == "staging") {
		// 			// staging
		// 			reset_url = "http://10.20.30.55"; //live
		// 			if (config.get('APP_ENV') == "sandbox") {
		// 				reset_url = "http://10.20.30.55:81"; //sandbox
		// 			}
		// 		} else {
		// 			// dev
		// 			reset_url = "http://localhost:4001";
		// 		}
		// 		console.log(reset_url + '/' + reset_path)
		// 		// Send Email!
		// 		emailTemplateSender.sendToClient(client,
		// 			"forgot_password", {
		// 				reset_url: reset_url + '/' + reset_path
		// 			}, function(err, data) {
		// 				return cb(null, 'email sent');
		// 			}
		// 		);

		// 	});
		// });
	},

	reset: function(cb) {
		// var self = this;
		// console.log('this.params', self.params)
		// models.Client.findOne({
		// 	"forgot_token": self.params.token,
		// }, function(err, client) {

		// 	if (err) {
		// 		return cb(new errors.NotFoundError('Could not find reset token'));
		// 	}

		// 	if (client == null) {
		// 		return cb(new errors.NotFoundError('Could not find reset token.'));
		// 	}

		// 	if ((Math.floor(new Date() / 1000) - client.forgot_timestamp) > (24 * 60 * 60)) {
		// 		return cb(new errors.NotFoundError('Reset token has expired.'));
		// 	}

		// 	if (self.params.newpass == undefined || self.params.newpass == '' || self.params.newpass != self.params.newpass2) {
		// 		return cb(new errors.NotFoundError('New Passwords do not Match.'));
		// 	}

		// 	client.forgot_token = undefined;
		// 	client.forgot_timestamp = undefined;

		// 	client.password = self.params.newpass;

		// 	client.save(function(err) {
		// 		if (err) {
		// 			return cb(err);
		// 		}
		// 		return cb(null, 'Password has been reset.');
		// 	});

		// });
	}
};

module.exports = Authentication;