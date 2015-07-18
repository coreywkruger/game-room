var controlServices = angular.module('websocketServices', ['restangularServices', 'configServices']);

controlServices.factory('websocketService', ["$q", "restangularService", "configService",

	function($q, restangularService, configService) {
		return new function() {

			this.api = restangularService.one("room");
			this.socket;
			this.events = {};
			this.index = 10000000000;
			this.websocket_id;
			this.rooms = [];
			this.websockets_connected = false;

			this.acquireRoomIds = function() {
				var promise = this.api.get();
				promise.then(function(res) {
					this.room_ids = res.data;
				}.bind(this));
				return promise;
			};

			this.open = function(cb) {
				this.socket = new WebSocket(configService.websocket_host);
				this.socket.onopen = function() {
					if (this.socket.bufferedAmount == 0) {
						this.sendMessage("connected", {});
						this.websockets_connected = true;
						cb();
					}
				}.bind(this);
			};

			this.resart = function() {
				this.socket.close();
				this.socket = undefined;
				this.websocket_id = undefined;
				this.room_ids = [];
				this.init();
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
					var msg = deserialize(event.data);
					if (this.websocket_id) {
						if (this.websocket_id == msg.websocket_id) {
							if (this.events[msg.event]) {
								this.events[msg.event](msg);
							}
						}
					} else {
						this.websocket_id = msg.websocket_id;
						this.room_ids = msg.data.rooms;
						this.roomIdPromise.resolve(this.room_ids);
						this.userIdPromise.resolve(this.websocket_id);
					}
				}.bind(this);
			};

			this.roomIdPromise = $q.defer();
			this.getRoomIds = function() {
				return this.roomIdPromise.promise;
			};

			this.currentRoomIdPromise = $q.defer();
			this.getCurrentRoomId = function() {
				return this.currentRoomIdPromise.promise;
			};

			this.userIdPromise = $q.defer();
			this.getUserId = function() {
				return this.userIdPromise.promise;
			};

			this.sendMessage = function(event, args) {
				this.socket.send(JSON.stringify({
					"event": event,
					"data": args,
					"api-key": this.api_key,
					"websocket_id": this.websocket_id
				}));
			};

			function deserialize(data) {
				return JSON.parse(data);
			}
		}
	}
]);