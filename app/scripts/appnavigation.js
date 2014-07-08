'use strict';

angular.module('personalApp.appnavigation', [])

.controller('NavCtrl', [
	'$scope',
    'AppservUtils',
	function($scope, AppservUtils) {
        
        $scope.navVisible = function() {
            // this one was slow !$state.is($scope.stateHome);
            return $scope.currentViewName !== $scope.stateHome;
        };
        
        $scope.navDecoration = function(type, prop, sectionCheck) {
            var _sectionValidation = (
                angular.isDefined(sectionCheck) &&
                sectionCheck !== $scope.currentState.currentSectionRef
            );
            if(_sectionValidation) {
                return false;
            } else {
                return AppservUtils.decorationCssClass(
                    type,
                    prop,
                    $scope.currentState.currentSectionRef + 1
                );
            }
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