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

app.run(['$state', '$rootScope', 'websocketService', 'parallelKeyService',
	function($state, $rootScope, websocketService, parallelKeyService) {

		websocketService.init('localhost', '3334');
		// websocketService.addEvent('connected', function() {

		// });
		websocketService.listen();

		parallelKeyService.setFun("68" /*d*/ , function() {
			console.log("d");
		});
		parallelKeyService.setFun("83" /*s*/ , function() {
			console.log("s");
		});
		parallelKeyService.setFun("65" /*a*/ , function() {
			console.log("a");
		});
		parallelKeyService.setFun("87" /*w*/ , function() {
			console.log("w");
		});
		parallelKeyService.startControls();
	}
]);