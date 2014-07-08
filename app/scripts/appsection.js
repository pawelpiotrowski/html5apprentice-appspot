'use strict';

angular.module('personalApp.appsection', [])

.controller('SectionCtrl', [
    '$scope',
    function($scope) {
        console.log('SECTION CTRL');
        var _sectionState = $scope.currentState.toState.name;
        var _sectionContentRef = $scope.sectionsSlugs.indexOf(_sectionState);
        var _sectionContent = (_sectionContentRef < 0) ? $scope.appErr.handler('no-content') : $scope.sections[_sectionContentRef];
        $scope.sectionContent = _sectionContent.payload;
        console.log($scope.sectionContent);
        
        $scope.mainBckgd = $scope.appUtils.decorationCssClass('main','background');
        $scope.mainBorder = $scope.appUtils.decorationCssClass('main','border');
        $scope.mainColor = $scope.appUtils.decorationCssClass('main','color');
        
        $scope.contraBckgd = $scope.appUtils.decorationCssClass('contra','background');
        $scope.contraBorder = $scope.appUtils.decorationCssClass('contra','border');
        $scope.contraColor = $scope.appUtils.decorationCssClass('contra','color');
    }
])

.controller('SectionDetailCtrl', [
    '$scope',
    function($scope) {
        console.log('SECTION DETAIL CTRL');
    }
]);