const App = require('./app/app');

var app = new App().start(function(err) {
	if (err) {
		console.log(err);
		process.exit(1);
	}
});