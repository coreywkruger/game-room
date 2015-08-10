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
				controller: function($scope) {}
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
				template: '<div ui-view></div>',
				controller: function($state){
					if($state.current.name !== "'rooms.detail.claim" &&
						$state.current.name !== "'rooms.detail.open"){
						$state.go("rooms.detail.claim")
					}
				}
			})
			.state('rooms.detail.claim', {
				url: '/claim-name',
				authenticate: false,
				templateUrl: '/partials/claim-name.html',
				controller: 'roomClaimNameController'
			})
			.state('rooms.detail.open', {
				url: '/open?name',
				authenticate: false,
				templateUrl: '/partials/rooms-detail.html',
				controller: 'roomDetailController'
			})
	}
]);

app.run(['$state', '$rootScope', 'websocketService', 'parallelKeyService', 'sceneService',
	function($state, $rootScope, websocketService, parallelKeyService, sceneService) {

		websocketService.addEvent("scene_add_player", function(msg) {
			console.log("add player");
			var agent_id = msg.agent;
			if (agent_id !== websocketService.key &&
				sceneService.getObject(agent_id) == null) {
				sceneService.createAgent(agent_id);
			}
		});

		websocketService.addEvent("scene_remove_player", function(msg) {
			console.log("remove player");
			var remove_me = msg.agent
			if (remove_me !== websocketService.key) {
				console.log("IN");
				sceneService.deleteObject(remove_me);
			}
		});

		websocketService.addEvent("scene_updated", function(msg) {
			var ags = msg.agents;
			console.log(ags)
			for (var key in ags) {
				if(ags[key].id !== websocketService.key){
					var obj = sceneService.getObject(ags[key].id);
					sceneService.translateObject(obj.name, ags[key].position);
					sceneService.rotateObject(obj.name, ags[key].rotation);
				}
			}
		});

		websocketService.addEvent("room_not_found", function(msg) {
			websocketService.leaveRoom(function() {
				websocketService.close();
				sceneService.newScene();
				clearInterval(sceneService.render);
				$("#Screen1").empty();
				$state.go('rooms.list');
			});
		});

		parallelKeyService.setFun("83" /*s*/ , function() {
			sceneService.move_backward(sceneService.agent, function() {
				websocketService.sendMessage("translate", [
					sceneService.agent.position.x,
					sceneService.agent.position.y,
					sceneService.agent.position.z
				]);
			});
		});

		parallelKeyService.setFun("87" /*w*/ , function() {
			sceneService.move_forward(sceneService.agent, function() {
				websocketService.sendMessage("translate", [
					sceneService.agent.position.x,
					sceneService.agent.position.y,
					sceneService.agent.position.z
				]);
			});
		});

		parallelKeyService.setFun("68" /*d*/ , function() {
			sceneService.rotate_right(sceneService.agent, function() {
				websocketService.sendMessage("rotate", [
					sceneService.agent.rotation.x,
					sceneService.agent.rotation.y,
					sceneService.agent.rotation.z
				]);
			});
		});
		parallelKeyService.setFun("65" /*a*/ , function() {
			sceneService.rotate_left(sceneService.agent, function() {
				websocketService.sendMessage("rotate", [
					sceneService.agent.rotation.x,
					sceneService.agent.rotation.y,
					sceneService.agent.rotation.z
				]);
			});
		});

		parallelKeyService.startControls();
	}
]);
