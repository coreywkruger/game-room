const config = require('./../../config/config.json'),
	isValid = require('./../../lib/is_valid'),
	errors = require('./../../lib/errors'),
	models = require('./../models');

var Transform = {
	translate: function(params, cb) {
		console.log(params);
		cb(null, {});
	}
};

module.exports = Transform;