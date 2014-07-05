'use strict';

angular.module('personalApp.appcontroller', [])

.controller('MainCtrl', [
    '$scope',
    '$state',
    'AppservLog',
    'AppservError',
    'AppfactConfig',
    'AppservUtils',
    'appSettings',
    function($scope, $state, AppservLog, AppservError, AppfactConfig, AppservUtils, appSettings) {

        //$scope.$route = $route;
        //$scope.$location = $location;
        //$scope.$routeParams = $routeParams;

        $scope.appLog = AppservLog.log;
        
        $scope.appErr = AppservError;

        $scope.sections = AppfactConfig.getRoutedSections();
        $scope.sectionsSlugs = AppfactConfig.getRoutedSlugs();
        $scope.stateSlugs = appSettings.stateSlugs;
        
        $scope.cssSlugs = 
        
        $scope.stateHome = $scope.stateSlugs.home;
        $scope.statePage404 = $scope.stateSlugs.page404;
        
        
        
        $scope.mainBckgd = AppservUtils.decorationCssClass('main','background');
        $scope.mainBorder = AppservUtils.decorationCssClass('main','border');
        $scope.mainColor = AppservUtils.decorationCssClass('main','color');
        
        $scope.contraBckgd = AppservUtils.decorationCssClass('contra','background');
        $scope.contraBorder = AppservUtils.decorationCssClass('contra','border');
        $scope.contraColor = AppservUtils.decorationCssClass('contra','color');
        
        $scope.viewsDir = appSettings.templatesDir;
        $scope.partialsDir = appSettings.partialsDir;
        
        $scope.viewCssClass = '';
        
        $scope.currentState = {};
        
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams) {
            
            var _stateObj = AppservUtils.extractPath(toState.name);
            
            var _stateClass = _stateObj.viewCssClass;
            var _sectionRef = _stateObj.sectionReference;
            
            if(_sectionRef >= 0) {
                _stateClass += ' '+AppservUtils.paletteCssClass(_sectionRef);
            }
            
            $scope.viewCssClass = _stateClass;
            $scope.currentState = {
                event: event,
                toState: toState,
                toParams: toParams
            };
        });
        
        $scope.changeLocation = function(statename) {
            $state.go(statename);
        };
		
        AppfactConfig.getContentPromise().then(function(d) {
            angular.forEach($scope.sections, function(thisSection, sectionIndex) {
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