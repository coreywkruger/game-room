var restangularServices = angular.module('restangularServices', ['restangular', 'configServices']);

restangularServices.factory('restangularService', ['Restangular', 'configService',
	function(Restangular, bdConfigService) {

		return Restangular.withConfig(function(RestangularConfigurer) {

			// Configure base URL prefix for API.
			RestangularConfigurer.setBaseUrl(bdConfigService.api_host + '/v1');

			// // Submit form data as a form submissions would.
			RestangularConfigurer.setDefaultHeaders({
				'Content-Type': 'application/json'
			});
		});
	}
]);