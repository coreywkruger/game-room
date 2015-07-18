var app = angular.module('game', [
	'canvasMods',
	'sceneServices',
	'controlServices',
	'websocketServices',
	'roomControllers',
	'templates',
	'ui.router'
]);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider',
	function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

		// use the HTML5 History API
		// $locationProvider.html5Mode(true);
		// $httpProvider.interceptors.push('');
		$stateProvider
			.state('room-list', {
				url: '/roomlist',
				authenticate: false,
				controller: 'roomListController',
				templateUrl: '/partials/room-list.html'
			})
	}
]);

app.run(['$state', '$rootScope', 'websocketService', 'parallelKeyService',
	function($state, $rootScope, websocketService, parallelKeyService) {

		websocketService.addEvent("room_selected", function(msg) {
			console.log("New Room: ", msg);
			websocketService.currentRoomId = msg.data.room_id;
			websocketService.currentRoomIdPromise.resolve(websocketService.currentRoomId);
		});

		// websocketService.addEvent("disconnected", function(msg) {
		// 	// websocketService.restart();
		// 	// websocketService.socket.close();
		// 	websocketService.open();
		// 	websocketService.listen();
		// });

		parallelKeyService.setFun("68" /*d*/ , function() {
			// console.log("d");
			websocketService.sendMessage("translate", {
				"key": "d",
				"x": "1",
				"y": "2",
				"z": "3"
			})
		});
		parallelKeyService.setFun("83" /*s*/ , function() {
			// console.log("s");
			websocketService.sendMessage("translate", {
				"key": "s",
				"x": "1",
				"y": "2",
				"z": "3"
			})
		});
		parallelKeyService.setFun("65" /*a*/ , function() {
			// console.log("a");
			websocketService.sendMessage("translate", {
				"key": "a",
				"x": "1",
				"y": "2",
				"z": "3"
			})
		});
		parallelKeyService.setFun("87" /*w*/ , function() {
			// console.log("w");
			websocketService.sendMessage("translate", {
				"key": "w",
				"x": "1",
				"y": "2",
				"z": "3"
			})
		});
		parallelKeyService.startControls();
	}
]);