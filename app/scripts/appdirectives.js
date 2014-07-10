'use strict';

angular.module('personalApp.appdirectives', [])

.directive('appdirBindWindowResizeEnd', [
    '$window',
    '$document',
    function($window, $document) {
        return {
            restrict: 'A',
            link: function(scope) {
                
                var resizeEndBroadcast = function() {
                    var w = $window,
                        d = $document[0],
                        e = d.documentElement,
                        g = d.getElementsByTagName('body')[0],
                        x = w.innerWidth || e.clientWidth || g.clientWidth,
                        y = w.innerHeight|| e.clientHeight|| g.clientHeight;
                    scope.$broadcast('windowresizeend', {
                        innerWidth: x,
                        innerHeight: y
                    });
                };
                
                var resizeTimeout;
                var resizeHandler = function() {
                    /*
                        yes it is weird however
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