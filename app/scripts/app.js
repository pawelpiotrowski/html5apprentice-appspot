'use strict';

window.ppApp = angular.module('personalApp', [
	'ngRoute'
])
.config(function ($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/intro.html',
		controller: 'IntroCtrl'
	})
	.when('/test', {
		templateUrl: 'views/test.html',
		controller: 'TestCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
});