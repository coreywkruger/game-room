var configServices = angular.module('configServices', []);

configServices.service('configService', ["$location", "$rootScope", "$q",
	function($location, $rootScope, $q) {

		var api_port = "3333";
		var websocket_port = "3334";

		this.api_host = "http://localhost:" + api_port;
		this.websocket_host = "ws://localhost:" + websocket_port;
	}
]);