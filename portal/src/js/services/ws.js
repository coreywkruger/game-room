var controlServices = angular.module('websocketServices', []);

controlServices.factory('websocketService', ["$q",
	function($q) {
		return new function() {


			this.socket;
			this.events = {};
			this.index = 10000000000;
			this.websocket_id;
			this.rooms = [];

			this.init = function(host, port) {

				this.socket = new WebSocket('ws://' + host + ':' + port); //new WebSocket('ws://localhost:3334');
				this.socket.onopen = function() {
					setInterval(function() {
						console.log('interval', this.websocket_id);
						if (this.socket.bufferedAmount == 0) {
							// this.socket.send(JSON.stringify({
							// 	"event": "connected",
							// 	"data": {
							// 		"room_id": "12345"
							// 	},
							// 	"api-key": "abcdefg",
							// 	"websocket_id": this.websocket_id
							// }));
						}
					}.bind(this), 1000);
				}.bind(this);
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
					console.log(msg);
					if (this.websocket_id) {
						if (this.websocket_id == msg.websocket_id) {
							if (this.events[msg.event]) {
								this.events[msg.event]();
							}
						}
					} else if (msg.event == "initialized") {
						console.log(msg.websocket_id);

						this.websocket_id = msg.websocket_id;
						this.room_ids = msg.data.rooms;
						this.socket.send(JSON.stringify({
							"event": "rooming",
							"data": {
								"room_id": this.room_ids[0]
							},
							"api-key": "abcdefg",
							"websocket_id": this.websocket_id
						}));
					}
				}.bind(this);
			};

			function deserialize(data) {
				return JSON.parse(data);
			}
		}
	}
]);