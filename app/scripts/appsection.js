'use strict';

angular.module('personalApp.appsection', [])

.controller('SectionCtrl', [
    '$scope',
    function($scope) {
        console.log('SECTION CTRL');
    }
])

.controller('SectionDetailCtrl', [
    '$scope',
    function($scope) {
        console.log('SECTION DETAIL CTRL');
    }
]);