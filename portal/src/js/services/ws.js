var controlServices = angular.module('websocketServices', ['restangularServices', 'sceneServices', 'configServices']);

controlServices.factory('websocketService', [
	"$q",
	"$stateParams",
	"$rootScope",
	"sceneService",
	"restangularService",
	"configService",

	function (
		$q,
		$stateParams,
		$rootScope,
		sceneService,
		restangularService,
		configService
	) {
		return new function () {

			this.api = restangularService.one("room");
			this.socket;
			this.events = {};
			this.index = 10000000000;
			this.name;
			this.rooms = [];
			this.room_id;
			this.key;
			$rootScope.websockets_connected = false;

			this.acquireRoomIds = function () {
				var promise = this.api.get();
				promise.then(function (res) {
					this.room_ids = res.data;
					console.log(this.room_ids);
				}.bind(this));
				return promise;
			};

			this.claimName = function (room_id, name) {
				var promise = this.api.one(room_id).one("name").post("", name);
				promise.then(function (res) {
					this.key = res;
					// console.log("Your key:", this.key);
					// console.log("Your name (pending):", this.name)
				}.bind(this));
				return promise;
			};

			this.loadScene = function (room_id) {
				var promise = this.api.one(room_id).one("scene").get();
				promise.then(function (res) {
					// this.room_ids = res.data;
				}.bind(this));
				return promise;
			};

			this.open = function (room_id, cb) {
				this.socket = new WebSocket(configService.websocket_host + configService.api_prefix +
					"/room/" + room_id +
					"?room_key=" + this.key);

				this.socket.onerror = function (error) {
					// $rootScope.websockets_connected = false;
					cb(error);
				}

				this.socket.onclose = function (event) {
					// $state.go("room.list")
				}

				this.socket.onopen = function () {
					if (this.socket.bufferedAmount == 0) {
						$rootScope.websockets_connected = true;
						cb(null);
					}
				}.bind(this);
			};

			this.close = function () {
				this.socket.close();
				this.socket = undefined;
				this.name = undefined;
				this.room_ids = [];
			};

			this.addEvent = function (event, cb) {
				this.events[event] = cb
			};

			this.removeEvent = function (event) {
				delete this.events[event];
			};

			this.listen = function () {
				this.socket.onmessage = function (event) {
					var msg = deserialize(event.data);
					console.log("Event", msg);
					this.events[msg.event](msg);
				}.bind(this);
			};

			this.roomIdPromise = $q.defer();
			this.getRoomIds = function () {
				return this.roomIdPromise.promise;
			};

			this.sendMessage = function (event, args) {
				this.socket.send(JSON.stringify({
					"event": event,
					"data": args
				}));
			};

			this.leaveRoom = function (cb) {
				// this.sendMessage("disconnect", {});
				$rootScope.name = "";
				$rootScope.room_id = "";
				$rootScope.websockets_connected = false;
				if (cb) cb();
			};

			this.isConnected = function () {
				return $rootScope.websockets_connected;
			};

			function deserialize(data) {
				return JSON.parse(data);
			}
		}
	}
]);
