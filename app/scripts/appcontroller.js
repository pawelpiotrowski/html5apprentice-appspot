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
        
        var setCurrentViewName = function(stateName) {
            var n = stateName.replace(/\..*$/,'');
            $scope.currentViewName = n;
        };
        
        $scope.viewCssClass = '';
        
        $scope.currentState = {};
        
        $scope.getCurrentPalette = function() {
            var _isViewSection = $scope.sectionsSlugs.indexOf($scope.currentViewName);
            var _validView = _isViewSection >= 0;
            var _palette = appSettings.palette;
            var _defaultPalette = _palette.sectionDefaultPalette;
            
            return (_validView) ? _palette.sections[_isViewSection] : _defaultPalette;
        };
        
        $scope.$on('$stateChangeStart', function(event, toState, toParams) {
            // console.log('ROUTE CHANGE START', event, toState, toParams);
            
            setCurrentViewName(toState.name);
            
			if(!AppfactConfig.contentReady() && $scope.currentViewName === $scope.stateHome) {
				console.log('***** Fetching sections content *****');
				AppfactConfig.fetchContent();
			}
            $scope.$broadcast('statechange::start');
        });
        
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams) {
            // console.log('ROUTE CHANGE SUCCESS', event, toState, toParams);
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
            setCurrentViewName(toState.name);
            $scope.$broadcast('statechange::success');
        });
        
        $scope.changeLocation = function(statename) {
            $state.go(statename);
        };
        
        // AppservUtils.fontTracking();
    }
])

.controller('PaletteTestCtrl', [
    '$scope',
    function($scope) {
        console.log('Palette test CTRL');
    }
]);