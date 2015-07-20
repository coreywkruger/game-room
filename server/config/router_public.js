const express = require('express'),
	controllers = require('../app/controllers'),
	_ = require('underscore'),
	ws = require('../config/router_ws');

var router = new express();
var wsserver = new ws();

router.all('/*', function(req, res, next) {
	next();
});

router.get('/', function(req, res, next) {
	res.json({
		hello: "world"
	})
});

router.get('/login', function(req, res, next) {
	controllers.login(req.body, function(err, data) {
		res.send(data)
	});
});

router.get('/signup', function(req, res, next) {
	controllers.create(req.body, function(err, data) {
		res.send(data)
	});
});

router.get('/room', function(req, res, next) {
	console.log("get rooms");
	var data = [];
	var rooms = wsserver.Lobby.rooms;
	for (var key in rooms) {
		data.push({
			id: rooms[key].id,
			users: _.size(rooms[key].users) || 0
		});
	}
	res.json({
		data: data
	});
	// var ids = _.keys(wsserver.Lobby.rooms);
	// res.json({
	// 	data: ids
	// });
});

router.post('/room/:id', function(req, res, next) {
	// wsserver.Lobby.rooms
	console.log("get room", req.params.id);
});


// router.get('/version', function(req, res, next) {
// 	var versionObj = config.get('version');
// 	versionObj.env = config.get('NODE_ENV');
// 	versionObj.app = config.get('APP_ENV');
// 	res.send(versionObj);
// });

module.exports = router;