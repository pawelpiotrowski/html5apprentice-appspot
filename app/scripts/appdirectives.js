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
    '$document',
    'AppservUtils',
    function($window, $document, AppservUtils) {
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
]);