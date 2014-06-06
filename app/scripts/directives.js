'use strict';

ppApp.directive('appdirIntro', [
	function() {
		return {
			restrict: 'A',
			link: function(scope, iElement, iAttr) {
				console.log(scope, iElement, iAttr);
			}
		};
	}
]);