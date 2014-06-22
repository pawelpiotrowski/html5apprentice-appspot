'use strict';

angular.module('personalApp.appcontroller', [])

.controller('MainCtrl', [
	'AppservLog',
	'AppfactConfig',
	'AppservConfig',
	'$scope',
	'$route',
	'$location',
	'$routeParams',
	function(AppservLog, AppfactConfig, AppservConfig, $scope, $route, $location, $routeParams) {

		$scope.content = null;

		$scope.$route = $route;
		$scope.$location = $location;
		$scope.$routeParams = $routeParams;

		$scope.appLog = AppservLog.log;

		$scope.sections = AppfactConfig.getRoutedSections();
		$scope.getAppColor = AppservConfig.getColorByArrPos;
		$scope.getAllColors = AppservConfig.getPallete;
		$scope.getColorNames = AppservConfig.getColors;
		$scope.$on('$routeChangeSuccess', function(event, next, current) {
			console.log('route changed!!');
			console.log(event, next, current);
		});
		$scope.changeLocation = function(url, force) {
			//this will mark the URL change
			$location.path(url); //use $location.path(url).replace() if you want to replace the location instead

			$scope = $scope || angular.element(document).scope();
			if(force || !$scope.$$phase) {
				//this will kickstart angular if to notice the change
				$scope.$apply();
			}
		};

		AppfactConfig.getContentPromise().then(function(d) {
			$scope.content = d;
		}, function(err) {
			$scope.appLog('warn', err);
		}, null);
	}
])

.controller('IntroCtrl', [
	'$scope',
	function($scope) {
		console.log('intro controller');
		console.log($scope.getAppColor(1));
	}
])

.controller('ProjectsCtrl', [
	'$scope',
	function($scope) {
		console.log($scope.$routeParams);
		$scope.projects = {
			id: $scope.$routeParams.id
		};
	}
])

.controller('AppendixCtrl', [
	'$scope',
	function($scope) {
		$scope.appendix = {
			id: $scope.$routeParams.name
		};
	}
])

.controller('TestCtrl', [
	'$scope',
	function($scope) {
		$scope.appPalette = $scope.getAllColors();
		$scope.appColorNames = $scope.getColorNames();
	}
]);