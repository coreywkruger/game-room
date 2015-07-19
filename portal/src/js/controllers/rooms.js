var roomControllers = angular.module('roomControllers', ['websocketServices']);

roomControllers.controller('roomListController', ['$scope', '$state', 'websocketService',
	function($scope, $state, websocketService) {
		console.log('herere');
		websocketService.acquireRoomIds().then(function(res) {
			$scope.room_ids = websocketService.room_ids;
			console.log($scope.room_ids);
		});

		// $scope.goToRoom = function(room_id) {
		// 	console.log("Connecting to: ", room_id);
		// 	websocketService.sendMessage("rooming", {
		// 		room_id: room_id
		// 	});
		// };

		// $scope.openConnetion = function() {
		// 	websocketService.openConnection('localhost', '3334', function() {
		// 		websocketService.listen();
		// 	});
		// };

		$scope.open = function(room_id) {
			$state.go('rooms.detail', {
				room_id: room_id
			});
			// websocketService.open(room_id, function(id) {
			// 	websocketService.listen();
			// 	console.log("OPENED");
			// 	$scope.$apply()
			// });
		};
	}
]);

roomControllers.controller('roomDetailController', ['$scope', '$state', '$stateParams', 'websocketService',
	function($scope, $state, $stateParams, websocketService) {

		websocketService.open($stateParams['room_id'], function(id) {
			websocketService.listen();
			console.log("OPENED");
			$scope.$apply()
		});

		$scope.leaveRoom = function() {
			$scope.current_room = "";
			$scope.id = "";
			websocketService.leaveRoom(function() {
				console.log("CLOSING");
				websocketService.close();
				$("#Screen1").remove();
				$state.go('rooms.list');
			});
		};
	}
]);