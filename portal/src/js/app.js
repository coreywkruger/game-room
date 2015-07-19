var app = angular.module('game', [
	// 'canvasMods',
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
		$urlRouterProvider.otherwise("/rooms/list");

		$stateProvider
			.state('rooms', {
				url: '/rooms',
				authenticate: false,
				template: '<div ui-view></div>',
				controller: function($scope) {
					console.log('herererereer');
				}
			})
			.state('rooms.list', {
				url: '/list',
				authenticate: false,
				templateUrl: '/partials/rooms-list.html',
				controller: 'roomListController'
			})
			.state('rooms.detail', {
				url: '/:room_id',
				authenticate: false,
				templateUrl: '/partials/rooms-detail.html',
				controller: 'roomDetailController'
			})
	}
]);

app.run(['$state', '$rootScope', 'websocketService', 'parallelKeyService', 'sceneService',
	function($state, $rootScope, websocketService, parallelKeyService, sceneService) {

		sceneService.newScene();


		websocketService.addEvent("scene_load", function(msg) {

			var agents = _.keys(msg.data.agents);

			sceneService.getScene().then(function(res) {
				sceneService.createAgent(websocketService.websocket_id, true);

				for (var i = 0; i < agents.length; i++) {
					if (agents[i] !== websocketService.websocket_id) {
						sceneService.createAgent(agents[i]);
					}
				}
			});
		});

		websocketService.addEvent("scene_add_player", function(msg) {
			console.log("add player");
		});

		websocketService.addEvent("scene_updated", function(msg) {
			// console.log('=====>>>', msg);
			var ags = msg.data.agents;
			for (var key in ags) {
				var obj = sceneService.getObject(key);
				console.log('||', key, ags[key]);
				if (obj) {
					sceneService.translateObject(key, ags[key].position);
					sceneService.rotateObject(key, ags[key].rotation);
				}
			}
		});

		parallelKeyService.setFun("83" /*s*/ , function() {
			sceneService.move_backward(sceneService.agent, function() {
				websocketService.sendMessage("translate", {
					x: sceneService.agent.position.x,
					y: sceneService.agent.position.y,
					z: sceneService.agent.position.z
				});
			});
		});

		parallelKeyService.setFun("87" /*w*/ , function() {
			sceneService.move_forward(sceneService.agent, function() {
				websocketService.sendMessage("translate", {
					x: sceneService.agent.position.x,
					y: sceneService.agent.position.y,
					z: sceneService.agent.position.z
				});
			});
		});

		parallelKeyService.setFun("68" /*d*/ , function() {
			sceneService.rotate_right(sceneService.agent, function() {
				websocketService.sendMessage("rotate", {
					x: sceneService.agent.rotation.x,
					y: sceneService.agent.rotation.y,
					z: sceneService.agent.rotation.z
				});
			});
		});
		parallelKeyService.setFun("65" /*a*/ , function() {
			sceneService.rotate_left(sceneService.agent, function() {
				websocketService.sendMessage("rotate", {
					x: sceneService.agent.rotation.x,
					y: sceneService.agent.rotation.y,
					z: sceneService.agent.rotation.z
				});
			});
		});

		parallelKeyService.startControls();
	}
]);