'use strict';

angular.module('personalApp.appdirectives', [])

.directive('appdirHtmlCssclass', [
    function() {
        return {
            restrict: 'A',
            link: function(scope, iElement) {
                iElement.removeClass('no-js').addClass('js');
                scope.$on('htmlclass::cursorPointer', function(event, classOn) {
                    var _class = 'cursor-pointer';
                    if(classOn) {
                        iElement.addClass(_class);
                    } else {
                        iElement.removeClass(_class);
                    }
                });
            }
        };
    }
])

.directive('appdirBindWindowResizeEnd', [
    '$window',
    'AppservUtils',
    function($window, AppservUtils) {
        return {
            restrict: 'A',
            link: function(scope) {

                var resizeEndBroadcast = function() {
                    var _s = AppservUtils.getWindowSize();
                    scope.$broadcast('windowresizeend', _s);
                };

                var resizeTimeout;

                var resizeHandler = function() {
                    /*
                        yes $window.setTimeout is weird however
                        $timeout digest was triggering
                        ng-class function on nav links
                    */
                    $window.clearTimeout(resizeTimeout);
                    resizeTimeout = $window.setTimeout(resizeEndBroadcast, 150);
                };
                angular.element($window).on('resize', resizeHandler);
            }
        };
    }
])

.directive('appdirIscroll', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, iElement) {
                
                var thisScroll = new IScroll(iElement.parent()[0], { mouseWheel: true });
                
                var refresh = function() {
                    $timeout(function() {
                        thisScroll.refresh();
                    }, 1);
                };
                
                scope.$on('$viewContentLoaded', function() {
                    refresh();
                });
                
                scope.$on('sectioncontent::loaded', function() {
                    refresh();
                });
                
                scope.$on('sectioncontent::refresh', function() {
                    refresh();
                });
                
                document.addEventListener('touchmove', function(e) {
                    e.preventDefault();
                }, false);
            }
        };
    }
]);