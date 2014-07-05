'use strict';

angular.module('personalApp.appcontroller', [])

.controller('MainCtrl', [
    '$scope',
    '$state',
    'AppservLog',
    'AppfactConfig',
    'AppservUtils',
    function($scope, $state, AppservLog, AppfactConfig, AppservUtils) {

        //$scope.$route = $route;
        //$scope.$location = $location;
        //$scope.$routeParams = $routeParams;

        $scope.appLog = AppservLog.log;

        $scope.sections = AppfactConfig.getRoutedSections();
        $scope.slugs = AppfactConfig.getRoutedSlugs();
        
        $scope.mainBckgd = AppservUtils.decorationCssClass('main','background');
        $scope.mainBorder = AppservUtils.decorationCssClass('main','border');
        $scope.mainColor = AppservUtils.decorationCssClass('main','color');
        
        $scope.contraBckgd = AppservUtils.decorationCssClass('contra','background');
        $scope.contraBorder = AppservUtils.decorationCssClass('contra','border');
        $scope.contraColor = AppservUtils.decorationCssClass('contra','color');
        
        $scope.viewCssClass = '';
        
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams) {
            console.log(event, toState, toParams);
            
            var _stateObj = AppservUtils.extractPath(toState.name);
            console.log(_stateObj);
            var _stateClass = _stateObj.viewCssClass;
            var _sectionRef = _stateObj.sectionReference;
            
            if(_sectionRef >= 0) {
                _stateClass += ' '+AppservUtils.paletteCssClass(_sectionRef);
            }
            
            $scope.viewCssClass = _stateClass;
            
        });
        
        $scope.changeLocation = function(statename) {
            $state.go(statename);
        };
		
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