var controlServices = angular.module('controlServices', []);

controlServices.factory('parallelKeyService', [

	function() {
		return new function() {

			this.funs = {};
			this.codes = {};

			this.setFun = function(key, cb) {
				this.funs[key] = cb;
			}.bind(this);

			var is_empty = function() {
				for (var key in this.codes) {
					if (this.codes[key]) return false;
				}
				return true;
			}.bind(this);

			var exec_funs = function() {
				for (var key in this.codes) {
					if (this.codes[key]) {
						if (this.funs[key]) {
							this.funs[key]();
						}
					}
				}
			}.bind(this);

			this.going = {
				val: false
			};

			this.startControls = function() {

				$(window).on('keydown', function(event) {
					this.codes[event.keyCode] = (event.type == 'keydown');
					this.going.val = true;
					// this.$apply();
				}.bind(this));

				$(window).on('keyup', function(event, a, b) {
					this.codes[event.keyCode] = (event.type == 'keydown');
					if (is_empty()) {
						this.going.val = false;
						// this.$apply();
					}
				}.bind(this));

				setInterval(function() {
					if (this.going.val) {
						exec_funs();
					}
				}.bind(this), 1);
			};
		}
	}
]);