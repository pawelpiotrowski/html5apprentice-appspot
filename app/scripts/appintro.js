'use strict';

angular.module('personalApp.appintro', [])

.controller('IntroCtrl', [
    '$scope',
    function($scope) {
        console.log('intro controller');
    }
])

.directive('appdirIntroNavigation', [
	'$http',
	'$compile',
	'$templateCache',
	function($http, $compile, $templateCache) {
		return {
			restrict: 'A',
			link: function(scope, iElement) {
				var s = scope.sections.length;
				scope.sectionDivider = function() {
					return (100 / s)+'%';
				};
				$http.get(scope.viewsDir+'intro-navigation.html', {cache: $templateCache}).success(function(tplContent){
					iElement.append($compile(tplContent)(scope));
				});
			}
		};
	}
]);