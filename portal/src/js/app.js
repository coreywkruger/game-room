var app = angular.module('game', [
	'canvasMods',
	'sceneServices',
	'controlServices',
	'websocketServices',
	'ui.router'
]);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider',
	function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

		// use the HTML5 History API
		// $locationProvider.html5Mode(true);
		// $httpProvider.interceptors.push('stackKeyInterceptor');
		// $stateProvider
		//   .state('home', {
		//     url: '/home',
		//     authenticate: false,
		//     controller: 'homeCtrl',
		//     templateUrl: '/templates/home.html'
		//   })

	}
]);

app.run(['$state', '$rootScope', 'websocketService',
	function($state, $rootScope, websocketService) {

		websocketService.init('localhost', '3334');
		// websocketService.addEvent('connected', function() {

		// });
		websocketService.listen();
	}
]);