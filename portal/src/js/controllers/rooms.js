var roomControllers = angular.module('roomControllers', ['websocketServices']);

roomControllers.controller('roomListController', ['$scope', '$state', 'websocketService',
	function($scope, $state, websocketService) {

		// websocketService.getRoomIds().then(function(res) {
		websocketService.acquireRoomIds().then(function(res) {
			$scope.room_ids = websocketService.room_ids;
		});

		websocketService.getUserId().then(function(res) {
			$scope.id = websocketService.websocket_id;
		});

		$scope.goToRoom = function(room_id) {
			console.log("Connecting to: ", room_id);
			websocketService.sendMessage("rooming", {
				room_id: room_id
			});
			websocketService.getCurrentRoomId().then(function(res) {
				$scope.current_room = websocketService.currentRoomId;
			});
		};

		$scope.leaveRoom = function() {
			$scope.current_room = "";
			websocketService.leaveRoom(function() {
				console.log("CLOSING");
				websocketService.close();
			});
		};

		$scope.openConnetion = function() {
			websocketService.openConnection('localhost', '3334', function() {
				websocketService.listen();
			});
		};

		$scope.open = function(room_id) {
			websocketService.open(room_id, function() {
				websocketService.listen();
				console.log("OPENED")
				$scope.$apply()
			});
		};
	}
]);