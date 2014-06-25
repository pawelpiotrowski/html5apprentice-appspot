'use strict';

angular.module('personalApp.appnavigation', [])

.controller('NavCtrl', [
	'$scope',
	function($scope) {
		console.log('nav controller');
		console.log($scope.getAppColor(1));
	}
])

.directive('appdirNavigation', [
	'$http',
	'$compile',
	'$templateCache',
	function($http, $compile, $templateCache) {
		return {
			restrict: 'A',
			controller: 'NavCtrl',
			link: function(scope, iElement) {
				$http.get('partials/navigation.html', {cache: $templateCache}).success(function(tplContent){
					iElement.append($compile(tplContent)(scope));
				});
			}
		};
	}
]);