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

        $scope.appLog = AppservLog.log;
        
        $scope.appErr = AppservError;
        
        $scope.appUtils = AppservUtils;

        $scope.sections = AppfactConfig.getRoutedSections();
        $scope.sectionsSlugs = AppfactConfig.getRoutedSlugs();
        $scope.stateSlugs = appSettings.stateSlugs;
        $scope.stateCssSlugs = appSettings.stateCssSlugs;
        
        $scope.stateHome = $scope.stateSlugs.home;
        $scope.statePage404 = $scope.stateSlugs.page404;
        
        $scope.viewsDir = appSettings.templatesDir;
        $scope.partialsDir = appSettings.partialsDir;
        
        $scope.currentViewName = '';
        
        $scope.viewCssClass = '';
        
        $scope.currentState = {};
        
        $scope.$on('$stateChangeStart', function(event, toState, toParams) {
            console.log('ROUTE CHANGE START');
            //console.log(event, toState, toParams);
            $scope.currentViewName = toState.name;
        });
        
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams) {
            console.log('ROUTE CHANGE SUCCESS');
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
                toParams: toParams,
                currentSectionRef: _sectionRef
            };
            $scope.currentViewName = toState.name;
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
        
        // AppservUtils.fontTracking();
    }
])

.controller('PaletteTestCtrl', [
    '$scope',
    function($scope) {
        console.log('Palette test CTRL');
    }
]);