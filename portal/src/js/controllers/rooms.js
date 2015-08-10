var roomControllers = angular.module('roomControllers', ['websocketServices']);

roomControllers.controller('roomListController', ['$scope', '$state', 'websocketService',
	function ($scope, $state, websocketService) {

		websocketService.acquireRoomIds().then(function (res) {
			$scope.room_ids = websocketService.room_ids;
			// console.log($scope.room_ids);
		});

		$scope.open = function (room_id) {
			websocketService.room_id = room_id
			$state.go('rooms.detail.claim', {
				room_id: room_id
			});
		};
	}
]);

roomControllers.controller('roomClaimNameController', ['$scope', '$state', '$stateParams', 'websocketService',
	function ($scope, $state, $stateParams, websocketService) {

		$scope.name = "";

		$scope.submit = function(){
			websocketService.claimName($stateParams["room_id"], $scope.name).then(function(res){
				$state.go("rooms.detail.open", {
					room_id: $stateParams["room_id"],
					name: $scope.name
				})
			}).catch(function(res){
				console.log("Name already taken");
			})
		}
	}
]);

roomControllers.controller('roomDetailController', ['$scope', '$state', '$stateParams', 'sceneService', 'websocketService',
	function ($scope, $state, $stateParams, sceneService, websocketService) {
		console.log("=======", $stateParams);
		var halt = false;
		var animloop = function (){
			sceneService.render();
			if(!halt) setTimeout(animloop, 1000 / 60)
		};

		sceneService.newScene();
		sceneService.getScene().then(function (res) {
			$("#Screen1").append(sceneService.getElement());
			setTimeout(animloop, 1000 / 60)
		});

		websocketService.open($stateParams['room_id'], function (err) {

			if(err !== null){
				$state.go("rooms.list")
			}

			websocketService.listen();
			websocketService.loadScene($stateParams['room_id']).then(function (loadSceneRes) {

				sceneService.createAgent(websocketService.key, true);

				var agents = loadSceneRes.agents;

				for (var i = 0; i < agents.length; i++) {
					if (agents[i].id !== websocketService.key && sceneService.getObject(agents[i].id) == null) {
						var obj = sceneService.createAgent(agents[i].id);
						sceneService.translateObject(obj.name, agents[i].position);
						sceneService.rotateObject(obj.name, agents[i].rotation);
					}
				}
			});
		});

		$scope.leaveRoom = function () {
			websocketService.leaveRoom(function () {
				websocketService.close();
				clearTimeout(animloop)
				halt = true;
				$("#Screen1").empty();
				$state.go('rooms.list');
			});
		};
	}
]);
