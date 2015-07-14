const bcrypt = require('bcrypt'),
	mongoose = require('mongoose'),
	SALT_WORK_FACTOR = 10;

var User = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		unique: false
	},
	created_at: {
		type: Number
	},
	updated_at: {
		type: Number
	}
}, {
	collection: 'users'
});

User.pre('save', function(next) {

	now = Math.floor(new Date() / 1000);
	this.updated_at = now;
	if (!this.created_at) {
		this.created_at = now;
	}

	if (!this.isModified('password')) {
		return next();
	}
	// == THEN DO Password hash
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) {
			return next(err);
		}

		bcrypt.hash(this.password, SALT_WORK_FACTOR, function(err, hash) {
			if (err) {
				return next(err);
			}
			this.password = hash;
			next();
		}.bind(this));
	}.bind(this));
	// == DO Password hash
});

User.methods.comparePassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

// Client.methods.pretty = function() {

// 	return {
// 		id: this._id.toString(),
// 		api_key: this.api_key,
// 		api_secret: this.api_secret,

// 		email: this.email,
// 		webhook: this.webhook,
// 		name: this.name,
// 		phone: this.phone,
// 		balances: this.balances,
// 		company: this.company,
// 		type: this.type,
// 		branding: this.branding,

// 		street_address_1: this.street_address_1,
// 		street_address_2: this.street_address_2,

// 		country: this.country,
// 		city: this.city,
// 		state: this.state,
// 		zip: this.zip,
// 		tax_id: this.tax_id,
// 		website: this.website,
// 		portal_features: this.portal_features,
// 		currency: this.currency,
// 		updated_at: this.updated_at,
// 		created_at: this.created_at
// 	}
// }

module.exports = mongoose.model('User', User);