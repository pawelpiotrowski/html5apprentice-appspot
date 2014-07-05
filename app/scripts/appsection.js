'use strict';

angular.module('personalApp.appsection', [])

.controller('SectionCtrl', [
    '$scope',
    function($scope) {
        console.log('SECTION CTRL');
        console.log($scope.currentState);
        console.log($scope.sectionsSlugs);
        console.log($scope.sections);
        var _sectionState = $scope.currentState.toState.name;
        var _sectionContentRef = $scope.sectionsSlugs.indexOf(_sectionState);
        var _sectionContent = (_sectionContentRef < 0) ? $scope.appErr.handler('no-content') : $scope.sections[_sectionContentRef];
        $scope.sectionContent = _sectionContent.payload;
        console.log($scope.sectionContent);
    }
])

.controller('SectionDetailCtrl', [
    '$scope',
    function($scope) {
        console.log('SECTION DETAIL CTRL');
    }
]);