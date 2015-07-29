var configServices = angular.module('configServices', []);

configServices.service('configService', ["$location", "$rootScope", "$q",
	function($location, $rootScope, $q) {

		var api_port = "3334";
		var websocket_port = "3334";

		this.api_host = "http://localhost:" + api_port; // "http://192.168.2.202:" + api_port;
		this.websocket_host = "ws://localhost:" + websocket_port; //"ws://192.168.2.202:" + websocket_port;
		this.api_prefix = "/v1";
	}
]);
