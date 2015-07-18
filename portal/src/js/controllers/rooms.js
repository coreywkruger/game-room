var roomControllers = angular.module('roomControllers', ['websocketServices']);

roomControllers.controller('roomListController', ['$scope', '$state', 'websocketService',
	function($scope, $state, websocketService) {

		// websocketService.getRoomIds().then(function(res) {
		websocketService.acquireRoomIds().then(function(res) {
			console.log(res);
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
			websocketService.sendMessage("leaving", {

			});
			$scope.current_room = "";
		};

		$scope.openConnetion = function() {
			websocketService.openConnection('localhost', '3334', function() {
				websocketService.listen();
			});
		};

		$scope.open = function() {
			websocketService.open(function() {
				websocketService.listen();
			});
		};
	}
]);