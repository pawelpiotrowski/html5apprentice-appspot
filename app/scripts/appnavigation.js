'use strict';

angular.module('personalApp.appnavigation', [])

.controller('NavCtrl', [
	'$scope',
    '$state',
	function($scope, $state) {
        $scope.navVisible = function() {
            return !$state.is($scope.stateHome);
        };
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
				$http.get(scope.partialsDir+'navigation.html', {cache: $templateCache}).success(function(tplContent){
					iElement.append($compile(tplContent)(scope));
				});
			}
		};
	}
]);