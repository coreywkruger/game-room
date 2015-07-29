var controlServices = angular.module('websocketServices', ['restangularServices', 'sceneServices', 'configServices']);

controlServices.factory('websocketService', ["$q", "$rootScope", "sceneService", "restangularService", "configService",

	function($q, $rootScope, sceneService, restangularService, configService) {
		return new function() {

			this.api = restangularService.one("room");
			this.socket;
			this.events = {};
			this.index = 10000000000;
			this.websocket_id;
			this.rooms = [];
			$rootScope.websockets_connected = false;

			this.acquireRoomIds = function() {
				var promise = this.api.get();
				promise.then(function(res) {
					this.room_ids = res.data;
					console.log(this.room_ids);
				}.bind(this));
				return promise;
			};

			this.loadScene = function(room_id) {
				var promise = this.api.one(room_id).one("scene").get();
				promise.then(function(res) {
					// this.room_ids = res.data;
					console.log(res);
				}.bind(this));
				return promise;
			};

			this.open = function(room_id, cb) {
				this.socket = new WebSocket(configService.websocket_host + configService.api_prefix + "/room/" + room_id);
				// console.log('+++', _.keys(this.events));
				this.socket.onopen = function() {
					if (this.socket.bufferedAmount == 0) {
						// this.sendMessage("rooming", {
						// 	room_id: room_id
						// });
						$rootScope.websockets_connected = true;


						this.loadScene(room_id)
							.then(function(res){



							var agents = _.keys(res.data);

							sceneService.getScene().then(function(res) {
								sceneService.createAgent("me"/*websocketService.websocket_id*/, true);

								for (var i = 0; i < agents.length; i++) {
									if (agents[i] !== "me" /*websocketService.websocket_id*/) {
										sceneService.createAgent(agents[i]);
									}
								}
							});
						}.bind(this))

						// cb();
					}
				}.bind(this);
			};

			this.close = function() {
				this.socket.close();
				this.socket = undefined;
				this.websocket_id = undefined;
				this.room_ids = [];
			};

			this.addEvent = function(event, cb) {
				this.events[event] = cb
			};

			this.removeEvent = function(event) {
				delete this.events[event];
			};

			this.listen = function() {
				console.log('listening');
				this.socket.onmessage = function(event) {
					console.log('------', event);
					var msg = deserialize(event.data);
					// console.log("Received Message: ", msg);
					if (msg.event == "room_selected") {
						this.websocket_id = msg.websocket_id;
						$rootScope.websocket_id = this.websocket_id;
						$rootScope.room_id = msg.data.room_id;
						$rootScope.$apply();
						// this.userIdPromise.resolve(this.websocket_id);
						if (this.events[msg.event]) {
							this.events[msg.event](msg);
						}

						this.sendMessage("scene_load", {
							room_id: $rootScope.room_id
						});
					} else {

						console.log("Event", msg.event);
						// if (this.websocket_id == msg.websocket_id) {
						this.events[msg.event](msg);
						// }
					}
				}.bind(this);
			};

			this.roomIdPromise = $q.defer();
			this.getRoomIds = function() {
				return this.roomIdPromise.promise;
			};

			this.sendMessage = function(event, args) {
				this.socket.send(JSON.stringify({
					"event": event,
					"data": args,
					// "api-key": this.api_key,
					// "websocket_id": this.websocket_id
				}));
			};

			this.leaveRoom = function(cb) {
				// this.sendMessage("disconnect", {});
				$rootScope.websocket_id = "";
				$rootScope.room_id = "";
				$rootScope.websockets_connected = false;
				if (cb) cb();
			};

			this.isConnected = function() {
				return $rootScope.websockets_connected;
			};

			function deserialize(data) {
				return JSON.parse(data);
			}
		}
	}
]);
