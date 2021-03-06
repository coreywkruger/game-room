var roomControllers = angular.module('roomControllers', ['websocketServices']);

roomControllers.controller('roomListController', ['$scope', '$state', 'websocketService',
	function($scope, $state, websocketService) {

		websocketService.acquireRoomIds().then(function(res) {
			$scope.room_ids = websocketService.room_ids;
			console.log($scope.room_ids);
		});

		$scope.open = function(room_id) {
			$state.go('rooms.detail', {
				room_id: room_id
			});
		};
	}
]);

roomControllers.controller('roomDetailController', ['$scope', '$state', '$stateParams', 'sceneService', 'websocketService',
	function($scope, $state, $stateParams, sceneService, websocketService) {

		sceneService.getScene().then(function(res) {

			$("#Screen1").append(sceneService.getElement());

			setInterval(sceneService.render, 40);
		});

		websocketService.open($stateParams['room_id'], function(id) {
			websocketService.listen();
			console.log("OPENED");
			$scope.$apply()
		});

		$scope.leaveRoom = function() {
			$scope.current_room = "";
			$scope.id = "";
			websocketService.leaveRoom(function() {
				websocketService.close();
				sceneService.newScene();
				clearInterval(sceneService.render);
				$("#Screen1").empty();
				$state.go('rooms.list');
			});
		};
	}
]);