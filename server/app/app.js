const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('../config/config.json');
const db = require('../config/db');
const _ = require('underscore');
const ws = require('../config/router_ws');

var App = function() {
	this.mongo = new db.Mongo();
	this.app = express();
	this.app.disable('x-powered-by');
	this.app.use(bodyParser.urlencoded({
		extended: false
	}));
	this.app.use(bodyParser.json());
	this.app.use(function(req, res, next) {
		console.log(req.method + ': ' + req.path);
		next();
	});
	this.ws = new ws();

	this.app.use(function(req, res, next) {
		res.header('Access-Control-Allow-Origin', req.headers.origin);
		res.header('Access-Control-Allow-Credentials', 'true');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Access-Control-Allow-Credentials');
		if ('OPTIONS' == req.method) {
			res.sendStatus(200);
		} else {
			next();
		}
	});

	// Attach Routers
	this.app.use('/', require('../config/router_public'));
	// this.app.use('/', require('../config/router_ws'));
	// this.app.use(Authenticator);
	// this.app.use('/v1/', require('../config/routing/http_router_private'));
	// this.app.use(errorHandler);



	// `boot2docker ip` === `192.168.59.103`
	this.host = config.app.host; // config.get('app').host; // '0.0.0.0';
	this.port = config.app.port; // config.get('app').port; // 8889;
};

App.prototype.start = function(cb) {
	// console.log('Current Environment: ', config.get('NODE_ENV'));
	console.log('[init] AppAPI Booting API...');

	// Connect to mongo
	this.mongo.connect(function(err) {
		if (err && cb) {
			return cb(err);
		}
		this.server = this.app.listen(this.port, this.host, function() {
			console.log('server listening over UNSECURED HTTP at port ' + this.port);
			if (cb) {
				return cb();
			}
		}.bind(this));
	}.bind(this));
};

function errorHandler(err, req, res, next) {
	var stack = (err.error ? (err.error.stack ? err.error.stack : '') : (err.stack ? err.stack : ''));
	console.log(err.code);
	if (err.detail) {
		console.log(err.detail);
	}
	console.log(stack);
};


module.exports = App;