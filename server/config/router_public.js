const express = require('express'),
	controllers = require('../app/controllers');

router = new express();

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

// router.get('/version', function(req, res, next) {
// 	var versionObj = config.get('version');
// 	versionObj.env = config.get('NODE_ENV');
// 	versionObj.app = config.get('APP_ENV');
// 	res.send(versionObj);
// });

module.exports = router;