'use strict';

angular.module('personalApp.apperror', [])

.service('AppservError', [
    'AppservLog',
    function(AppservLog) {
        this.handler = function() {
            console.log('Error handler');
        };
    }
]);