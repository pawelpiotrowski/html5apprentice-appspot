'use strict';

angular.module('personalApp.appsection', [])

.controller('SectionCtrl', [
    '$scope',
	'AppfactConfig',
    function($scope, AppfactConfig) {
        //console.log('SECTION CTRL');
        var _sectionState = $scope.currentViewName;
        //console.log(_sectionState);
        var _sectionContentRef = $scope.sectionsSlugs.indexOf(_sectionState);
        var _sectionContent = (_sectionContentRef < 0) ? $scope.appErr.handler('no-content') : $scope.sections[_sectionContentRef];
        
        $scope.mainBckgd = $scope.appUtils.decorationCssClass('main','background');
        $scope.mainBorder = $scope.appUtils.decorationCssClass('main','border');
        $scope.mainColor = $scope.appUtils.decorationCssClass('main','color');
        
        $scope.contraBckgd = $scope.appUtils.decorationCssClass('contra','background');
        $scope.contraBorder = $scope.appUtils.decorationCssClass('contra','border');
        $scope.contraColor = $scope.appUtils.decorationCssClass('contra','color');
        
        $scope.sectionContent = _sectionContent.payload;
		
		if(!$scope.sectionContent) {
			var populateContent = function(d) {
				angular.forEach($scope.sections, function(thisSection, sectionIndex) {
					thisSection.payload = d.sections[sectionIndex];
				});
				$scope.sectionContent = _sectionContent.payload;
			};
			
			var checkForContent = AppfactConfig.contentReady();
			
			if(checkForContent) {
				populateContent(checkForContent);
			} else {
				AppfactConfig.getContentPromise().then(function(d) {
					console.log(d);
					populateContent(d);
				}, function(err) {
					$scope.appLog('warn', err);
				}, null);
			}
		}
		
    }
])

.controller('SectionDetailCtrl', [
    '$scope',
    function($scope) {
        console.log('SECTION DETAIL CTRL');
    }
]);