'use strict';

angular.module('personalApp', [,
	'ngRoute',
	'personalApp.appconfig',
	'personalApp.appcontroller',
	'personalApp.appnavigation',
	'personalApp.dollmaker',
	'personalApp.dollhandcraft',
	'personalApp.logservice'
])
.config(function ($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/intro.html',
		controller: 'IntroCtrl'
	})
	.when('/about', {
		templateUrl: '/views/about.html'
	})
	.when('/projects', {
		templateUrl: '/views/projects.html'
	})
	.when('/projects/:id', {
		templateUrl: '/views/projects.html'
	})
	.when('/appendix', {
		templateUrl: '/views/appendix.html'
	})
	.when('/appendix/:name', {
		templateUrl: '/views/appendix.html'
	})
	.when('/test', {
		templateUrl: '/views/test.html'
	})
	.when('/404', {
		templateUrl: '404.html'
	})
	.otherwise({
		redirectTo: '/404'
	});
});