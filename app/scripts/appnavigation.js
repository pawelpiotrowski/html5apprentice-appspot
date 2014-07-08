'use strict';

angular.module('personalApp.appnavigation', [])

.controller('NavCtrl', [
	'$scope',
	function($scope) {
        
        $scope.navVisible = function() {
            // this one was slow !$state.is($scope.stateHome);
            return $scope.currentViewName !== $scope.stateHome;
        };
        
        $scope.navDecoration = function(type, prop, sectionCheck) {
            var _sectionCheck = angular.isDefined(sectionCheck);
            var _currentSectionRef = $scope.currentState.currentSectionRef;
            var _sectionValidation = _sectionCheck && sectionCheck !== _currentSectionRef;
            var _activeSlug = (_sectionCheck) ? ' ' + $scope.stateCssSlugs.sectionActive : '';
            if(_sectionValidation || $scope.currentViewName === $scope.stateHome) {
                return false;
            } else {
                return $scope.appUtils.decorationCssClass(type,prop,_currentSectionRef) + _activeSlug;
            }
        };
        
        // to use within nav hover style
        $scope.uniqueElClass = '';
        $scope.navHoverStyleString = '';
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
])

.directive('appdirNavigationHoverStyle', [
	function() {
		return {
			restrict: 'A',
			controller: 'NavCtrl',
			link: function(scope, iElement) {
                
                if(scope.$first) {
                    scope.$parent.uniqueClass = 'el' + scope.appUtils.uniqueid();
                }
                
                var _uniqueClassType = scope.$parent.uniqueClass+ '-' + (scope.$index + 1);
                var _hoverColor = scope.section.palette.contra;
                var _activeSlug = scope.stateCssSlugs.sectionActive;
                var _elSelector = '.' + _uniqueClassType + ':not(.'+_activeSlug+'):hover';
                var _elStyle = '{color:'+_hoverColor+'}';
                
                scope.$parent.navHoverStyleString += _elSelector+_elStyle;
                iElement.addClass(_uniqueClassType);
                
                if(scope.$last) {
                    console.log('APPEND CSS: ', scope.$parent.navHoverStyleString);
                    var styleEl = angular.element(document.createElement('style'));
                    var headEl = angular.element(document.getElementsByTagName('head')[0]);
                    styleEl.html(scope.$parent.navHoverStyleString);
                    headEl.append(styleEl);
                }
			}
		};
	}
]);