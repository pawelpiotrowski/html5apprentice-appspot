'use strict';

ppApp.service('AppservLog',[
	'$log',
	function($log) {
		this.log = function(logtype, logmsg) {
			var _logtype = 0;
			switch(logtype) {
				case 'log':
					_logtype = 'log';
					break;
				case 'warn':
					_logtype = 'warn';
					break;
				case 'info':
					_logtype = 'info';
					break;
				/*
				* this one caused error
				case 'err':
					_logtype = 'error';
					break;
				*/
				case 'debug':
					_logtype = 'debug';
					break;
			}
			if(_logtype === 0) {
				$log.error('Log type not valid, you were trying to say: ', logmsg);
			} else {
				$log[logtype](logmsg);
			}
		};
	}
]);