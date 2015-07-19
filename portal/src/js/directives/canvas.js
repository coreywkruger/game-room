// var threejs_canvas = angular.module('canvasMods', ['sceneServices', 'controlServices']);

// threejs_canvas.controller('canvasCtrl', ['$scope', 'mainSvc',
// 	function($scope, mainSvc) {

// 	}
// ]);

// threejs_canvas.directive('canvasDir', ['mainSvc', 'parallelKeyService',
// 	function(mainSvc, parallelKeyService) {
// 		return {
// 			// templateUrl: '/templates/canvas.html',
// 			restrict: 'A',
// 			controller: 'canvasCtrl',
// 			link: function(scope, element, attributes) {

// 				return;
// 				var socket = io.connect('192.168.2.200:8000'); //'http://localhost:8000');

// 				var me = randomAsciiString(100);

// 				socket.emit('id_me', {
// 					id: me
// 				});

// 				mainSvc.camera.position.set(0, 20000, 70000);
// 				mainSvc.createAgent(me, true);
// 				mainSvc.agent.add(mainSvc.camera);
// 				controlSvc.startControls(scope, mainSvc.agent, [
// 					rotate_right, move_backward, rotate_left, move_forward
// 				], update);

// 				socket.on('update_player_list', function(data) {

// 					console.log('updates', data);

// 					for (var i = 0; i < data.length; i++) {
// 						if (data[i].id !== me) {
// 							if (mainSvc.getObject(data[i].id) == undefined) {
// 								mainSvc.createAgent(data[i].id);
// 							} else {
// 								if (data[i].deleted) {
// 									mainSvc.deleteObject(data[i].id);
// 								}
// 							}
// 						}
// 					}
// 				});

// 				// console.log(me);
// 				socket.on('transform', function(data) {
// 					for (var i = 0; i < data.length; i++) {
// 						if (data[i].id !== me) {
// 							var ob = mainSvc.getObject(data[i].id);

// 							ob.position.x = data[i].position.x;
// 							ob.position.y = data[i].position.y;
// 							ob.position.z = data[i].position.z;

// 							ob.rotation.x = data[i].rotation.x;
// 							ob.rotation.y = data[i].rotation.y;
// 							ob.rotation.z = data[i].rotation.z;
// 						}
// 					}
// 				});

// 				mainSvc.setRenderer();
// 				element.append(mainSvc.getElement());

// setInterval(function() {
// 	mainSvc.render();
// }, 40);

// function rotate_left(ob, cb) {
// 	ob.rotation.y += Math.PI / 460;
// 	cb();
// }

// function rotate_right(ob, cb) {
// 	ob.rotation.y -= Math.PI / 460;
// 	cb();
// }

// function move_forward(ob, cb) {
// 	var els = ob.matrix.elements;
// 	var v = new THREE.Vector3(els[8], els[9], els[10]);
// 	ob.position.add(v.clone().setLength(-300));
// 	cb();
// }

// function move_backward(ob, cb) {
// 	var els = ob.matrix.elements;
// 	var v = new THREE.Vector3(els[8], els[9], els[10]);
// 	ob.position.add(v.clone().setLength(300));
// 	cb();
// }

// 				function update() {
// 					mainSvc.render();
// 					socket.emit('transform', {
// 						position: {
// 							x: mainSvc.agent.position.x,
// 							y: mainSvc.agent.position.y,
// 							z: mainSvc.agent.position.z
// 						},
// 						rotation: {
// 							x: mainSvc.agent.rotation.x,
// 							y: mainSvc.agent.rotation.y,
// 							z: mainSvc.agent.rotation.z
// 						}
// 					});
// 				}

// 				function randomString(length, chars) {
// 					if (!chars) {
// 						throw new Error('Argument \'chars\' is undefined');
// 					}

// 					var charsLength = chars.length;
// 					if (charsLength > 256) {
// 						throw new Error('Argument \'chars\' should not have more than 256 characters' + ', otherwise unpredictability will be broken');
// 					}
// 					//console.log('===', crypto);
// 					var arr = [];
// 					for (var i = 0; i < length; i++) {
// 						arr.push(Math.floor(Math.random() * 9));
// 					}

// 					var randomBytes = arr; //crypto.getRandomValues([]); // randomBytes console.log('___',randomBytes);
// 					var result = new Array(length);

// 					var cursor = 0;
// 					for (var i = 0; i < length; i++) {
// 						cursor += randomBytes[i];
// 						result[i] = chars[cursor % charsLength]
// 					};

// 					return result.join('');
// 				}

// 				/** Sync */
// 				function randomAsciiString(length) {
// 					return randomString(length,
// 						'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789');
// 				}

// 			}
// 		};
// 	}
// ]);