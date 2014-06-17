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