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

app.run(['$state', '$rootScope', 'websocketService', 'parallelKeyService', 'sceneService',
	function($state, $rootScope, websocketService, parallelKeyService, sceneService) {

		sceneService.newScene();

		websocketService.addEvent("scene_load", function(msg) {

			var agents = _.keys(msg.data.agents);

			for (var i = 0; i < agents.length; i++) {
				if (agents[i] !== websocketService.websocket_id) {
					sceneService.createAgent(agents[i]);
				}
			}
			sceneService.createAgent(websocketService.websocket_id, true);
			sceneService.newScene();
			sceneService.setRenderer();
			$("#Screen1").append(sceneService.getElement());
			setInterval(function() {
				sceneService.render();
			}, 40);
		});

		websocketService.addEvent("scene_add_player", function(msg) {
			console.log('====', msg);
		});

		websocketService.addEvent("scene_updated", function(msg) {

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