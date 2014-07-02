'use strict';

angular.module('personalApp.appcontroller', [])

.controller('MainCtrl', [
    '$scope',
    'AppservLog',
    'AppfactConfig',
    'AppservUtils',
    function($scope, AppservLog, AppfactConfig, AppservUtils) {

        //$scope.$route = $route;
        //$scope.$location = $location;
        //$scope.$routeParams = $routeParams;

        $scope.appLog = AppservLog.log;

        $scope.sections = AppfactConfig.getRoutedSections();
        $scope.slugs = AppfactConfig.getRoutedSlugs();
        
        $scope.viewCssClass = '';
        
        $scope.$on('$routeChangeSuccess', function() {
            var _routeObj = AppservUtils.extractPath($location.path());
            var _stateClass = _routeObj.viewCssClass;
            var _sectionRef = _routeObj.sectionReference;
            
            if(_sectionRef >= 0) {
                _stateClass += ' '+AppservUtils.paletteCssClass(_sectionRef);
            }
            
            $scope.viewCssClass = _stateClass;
        });
        /*
        $scope.changeLocation = function(url, force) {
            //this will mark the URL change
            $location.path(url); //use $location.path(url).replace() if you want to replace the location instead

            $scope = $scope || angular.element(document).scope();
            if(force || !$scope.$$phase) {
                //this will kickstart angular if to notice the change
                $scope.$apply();
            }
        };
		*/
        AppfactConfig.getContentPromise().then(function(d) {
            angular.forEach($scope.sections, function(thisSection,sectionIndex) {
                thisSection.payload = d.sections[sectionIndex];
            });
            console.log('After loop', $scope.sections);
        }, function(err) {
            $scope.appLog('warn', err);
        }, null);
    }
])

.controller('PaletteTestCtrl', [
    '$scope',
    function($scope) {
        console.log('Palette test CTRL');
    }
]);