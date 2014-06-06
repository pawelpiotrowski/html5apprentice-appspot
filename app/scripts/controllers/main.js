'use strict';

ppApp.controller('MainCtrl', [
	'AppservLog',
	'$scope',
	function(AppservLog, $scope) {
		var _colorNames = ['white', 'red', 'orange', 'blue', 'green', 'tan', 'dark'];
		var _palette = ['#fffffc', '#dd1e2f', '#ebb035', '#06a2cb', '#218559', '#d0c6b1', '#192823'];
		
		$scope.appPaletteLength = _palette.length;
		$scope.appLog = AppservLog.log;
		// app palette log
		(function() {
			var _log = [];
			$scope.appLog('info', 'APPLICATION PALETTE:');
			angular.forEach(_colorNames, function(k,v) {
				$scope.appLog('log', { name: k, val: _palette[v] });
			});
			return _log;
		})();
		
		$scope.getAppColor = function(colorPos) {
			var _arrPos = colorPos - 1;
			if(_arrPos < 0 || _arrPos >= _palette.length) {
				var warnmsg = 'Get app color out of range('+colorPos+' = '+_arrPos+'), returning (1): '+_colorNames[0]+' '+_palette[0];
				$scope.appLog('warn', warnmsg);
				_arrPos = 1;
			}
			return _palette[_arrPos];
		};
		$scope.getAllColors = function() {
			var _o = [];
			angular.extend(_o,_palette);
			return _o;
		};
		$scope.getColorNames = function() {
			var _o = [];
			angular.extend(_o,_colorNames);
			return _o;
		};
	}
]);

ppApp.controller('IntroCtrl', [
	'$scope',
	function($scope) {
		console.log('intro controller');
		console.log($scope.getAppColor(1));
	}
]);

ppApp.controller('TestCtrl', [
	'$scope',
	function($scope) {
		$scope.appPalette = $scope.getAllColors();
		$scope.appColorNames = $scope.getColorNames();
	}
]);