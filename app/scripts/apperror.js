'use strict';

angular.module('personalApp.apperror', [])

.service('AppservError', [
    'AppservLog',
    function(AppservLog) {
        this.handler = function() {
            AppservLog.log('info', 'Error handler called');
        };
    }
]);