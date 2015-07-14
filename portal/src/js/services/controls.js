var controlServices = angular.module('controlServices', []);

controlServices.factory('controlService', [

	function() {
		return new function() {

			this.startControls = function(scope, object, functions, cb) {

				var map = []; // Or you could call it "key"
				var onkeydown = keyfun;
				var onkeyup = keyfun;

				function keyfun(e) {
					e = e || event; // to deal with IE
					map[e.keyCode] = e.type == 'keydown';
				}

				scope.going = {
					val: false
				};

				$(window).on('keydown', function(event) {

					keyfun(event);
					scope.going.val = true;
					scope.$apply();
				});

				$(window).on('keyup', function(event, a, b) {

					keyfun(event);
					if (is_empty()) {
						scope.going.val = false;
						scope.$apply();
					}
				});

				setInterval(function() {
					if (scope.going.val) {
						exec_funs(map, object, functions);
					}
				}, 1);

				function is_empty() {
					for (var key in map) {
						if (map[key]) return false;
					}
					return true;
				}

				function exec_funs(codes, obj, funs) {

					for (var key in codes) {
						if (key == "68" && codes[key]) { // d
							funs[0](obj, cb);
						} else if (key == "83" && codes[key]) { // s
							funs[1](obj, cb);
						} else if (key == "65" && codes[key]) { // a
							funs[2](obj, cb);
						} else if (key == "87" && codes[key]) { // w
							funs[3](obj, cb);
						}
					}
				}
			};
		}
	}
]);