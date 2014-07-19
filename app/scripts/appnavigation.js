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
        
        // to use within nav hover style in nva items collector
        $scope.uniqueElClass = '';
        $scope.navHoverStyleString = '';
        
        // mobile nav
        $scope.mobileNavOn = false;
        $scope.mobileNavOpen = true;
        $scope.mobileNavOnCssClass = $scope.stateCssSlugs.mobileNavOn;
        $scope.mobileNavOpenCssClass = $scope.stateCssSlugs.mobileNavOpen;
        
        $scope.mobileNavToggle = function(navOn) {
            var s = (navOn) ? 'on' : 'off';
            if($scope.mobileNavOn !== navOn && $scope.navVisible) {
                $scope.mobileNavOn = navOn;
                $scope.$broadcast('mobilenav::'+s);
            }
        };
        
        $scope.mobileNavOpenToggle = function(navOpen) {
            var s = (navOpen) ? 'open' : 'close';
            if($scope.mobileNavOpen !== navOpen) {
                $scope.mobileNavOpen = navOpen;
                $scope.$broadcast('mobilenav::'+s);
            }
        };
        
        $scope.$on('statechange::start', function() {
            if($scope.navVisible && $scope.mobileNavOn && $scope.mobileNavOpen) {
                $scope.mobileNavOpen = false;
                $scope.$broadcast('mobilenav::close');
            }
        });
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
            link: function(scope, iElement) {
                
                var mobileNavOnCloseHeight = 0;
                var mobileNavOnOpenHeight = 0;
                
                var getNavCloseHeight = function() {
                    var _navItems = iElement.children();
                    var _navItem = _navItems[0];
                    var _navItemCss = scope.appUtils.getElementStyle(_navItem);
                    var _mt = parseInt(_navItemCss.marginTop, 10);
                    var _oh = _navItem.offsetHeight;
                    var _mb = parseInt(_navItemCss.marginBottom, 10);
                    var _h = _mt + _oh + _mb;
                    return {
                        closeHeight: _h,
                        openHeight: _h * _navItems.length
                    };
                };
                
                var setNavHeights = function() {
                    var _navHeights = getNavCloseHeight();
                    mobileNavOnCloseHeight = _navHeights.closeHeight + 'px';
                    mobileNavOnOpenHeight = _navHeights.openHeight + 'px';
                };
                
                scope.$on('navigationready', function() {
                    setNavHeights();
                    iElement.css('height', mobileNavOnCloseHeight);
                });
                
                scope.$on('mobilenav::on', function() {
                    setNavHeights();
                    iElement.css('height', mobileNavOnCloseHeight);
                    iElement.addClass(scope.mobileNavOnCssClass);
                });
                
                scope.$on('mobilenav::off', function() {
                    iElement.removeClass(scope.mobileNavOnCssClass);
                    iElement.css('height', 'auto');
                });
                
                scope.$on('mobilenav::open', function() {
                    iElement.addClass(scope.mobileNavOpenCssClass);
                    iElement.css('height', mobileNavOnOpenHeight);
                });
                
                scope.$on('mobilenav::close', function() {
                    iElement.removeClass(scope.mobileNavOpenCssClass);
                    iElement.css('height', mobileNavOnCloseHeight);
                });
            }
        };
    }
])

.directive('appdirMobileNavigation', [
    '$window',
    '$timeout',
    function($window, $timeout) {
        return {
            restrict: 'A',
            controller: 'NavCtrl',
            link: function(scope, iElement) {
                
                var _lastNavItem = null;
                var _lastNavItemRectRight = 0;
                
                var _getLastNavItemRectRight = function() {
                    if(_lastNavItemRectRight === 0 || !scope.mobileNavOn) {
                        _lastNavItemRectRight = _lastNavItem[0].getBoundingClientRect().right;
                    }
                    return _lastNavItemRectRight;
                };
                
                var checkIfMobile = function(windowSize) {
                    var _s = windowSize || scope.appUtils.getWindowSize();
                    var _ws = _s.innerWidth - _s.innerWidth * 0.1;
                    var _ler = _getLastNavItemRectRight();
                    return _ler >= _ws;
                };
                
                scope.$on('windowresizeend', function(event, windowSize) {
                    if(angular.isElement(_lastNavItem)) {
                        scope.mobileNavToggle(checkIfMobile(windowSize));
                    }
                });
                
                scope.$on('navigationready', function(event, lastnavel) {
                    _lastNavItem = lastnavel;
                    $timeout(function() {
                        scope.mobileNavToggle(checkIfMobile());
                    }, 1);
                });
                
                scope.$on('statechange::success', function() {
                    if(scope.navVisible) {
                        $timeout(function() {
                            scope.mobileNavToggle(checkIfMobile());
                        }, 1);
                    }
                });
                
                var mobileNavButtonClickHandler = function() {
                    var toggleState = scope.mobileNavOpen;
                    scope.mobileNavOpenToggle(!toggleState);
                };
                
                scope.$on('mobilenav::on', function() {
                    scope.mobileNavOpenToggle(false);
                    iElement.addClass(scope.mobileNavOnCssClass);
                    iElement.on('click', mobileNavButtonClickHandler);
                });
                
                scope.$on('mobilenav::off', function() {
                    iElement.removeClass(scope.mobileNavOnCssClass);
                    iElement.removeClass(scope.mobileNavOpenCssClass);
                    iElement.off('click', mobileNavButtonClickHandler);
                });
                
                scope.$on('mobilenav::open', function() {
                    iElement.addClass(scope.mobileNavOpenCssClass);
                });
                
                scope.$on('mobilenav::close', function() {
                    iElement.removeClass(scope.mobileNavOpenCssClass);
                });
            }
        };
    }
])

.directive('appdirNavigationItemsCollector', [
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