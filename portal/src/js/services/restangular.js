var restangularServices = angular.module('restangularServices', ['restangular', 'configServices']);

restangularServices.factory('restangularService', ['Restangular', 'configService',
	function(Restangular, configService) {

		return Restangular.withConfig(function(RestangularConfigurer) {

			// Configure base URL prefix for API.
			RestangularConfigurer.setBaseUrl(configService.api_host + configService.api_prefix);

			// // Submit form data as a form submissions would.
			RestangularConfigurer.setDefaultHeaders({
				'Content-Type': 'application/json'
			});
		});
	}
]);
