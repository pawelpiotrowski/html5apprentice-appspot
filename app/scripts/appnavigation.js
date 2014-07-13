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
        
        // mobile nav
        $scope.mobileNavOn = false;
        $scope.mobileNavOpen = true;
        
        $scope.mobileNavToggle = function(navOn) {
            var s = (navOn) ? 'ON' : 'OFF';
            console.log('*** Toggle mobile nav *** ', s);
        };
        
        $scope.mobileNavOpenToggle = function(navOpen) {
            var s = (navOpen) ? 'OPEN' : 'CLOSE';
            console.log('*** Toggle opening mobile nav *** ', s);
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
])

.directive('appdirNavigationHolder', [
    function() {
        return {
            restrict: 'A',
            controller: 'NavCtrl',
            link: function(scope, iElement, iAttr) {
                console.log('NAV COLLECTION');
            }
        };
    }
])
// Consider Mobile nav controller for nav states

.directive('appdirMobileNavigation', [
    '$window',
    function($window) {
        return {
            restrict: 'A',
            controller: 'NavCtrl',
            link: function(scope, iElement) {
                var _lastNavItem = null;
                console.log(parseInt($window.getComputedStyle(iElement[0]).marginTop, 10));
                console.log($window.getComputedStyle(iElement[0]).marginBottom);
                console.log(iElement[0].getBoundingClientRect());
                
                var checkIfMobile = function(windowSize) {
                    var _s = windowSize || scope.appUtils.getWindowSize();
                    var _ws = _s.innerWidth - _s.innerWidth * 0.1;
                    var _ler = _lastNavItem[0].getBoundingClientRect().right;
                    
                    return _ler >= _ws;
                };
                
                var _navitems = [];
                
                scope.$on('registernavitem', function(event, navitem) {
                    _navitems.push(navitem);
                });
                
                scope.$on('windowresizeend', function(event, windowSize) {
                    if(angular.isElement(_lastNavItem)) {
                        scope.mobileNavToggle(checkIfMobile(windowSize));
                    }
                });
                
                scope.$on('navigationready', function(event, lastnavel) {
                    console.log(lastnavel);
                    _lastNavItem = lastnavel;
                    console.log(parseInt($window.getComputedStyle(iElement[0]).marginTop, 10));
                    console.log($window.getComputedStyle(iElement[0]).marginBottom);
                    console.log(iElement[0].getBoundingClientRect());
                    console.log(_navitems);
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
                scope.$emit('registernavitem', iElement);
                
                if(scope.$last) {
                    var styleEl = angular.element(document.createElement('style'));
                    var headEl = angular.element(document.getElementsByTagName('head')[0]);
                    styleEl.html(scope.$parent.navHoverStyleString);
                    headEl.append(styleEl);
                    scope.$emit('navigationready', iElement);
                }
            }
        };
    }
]);