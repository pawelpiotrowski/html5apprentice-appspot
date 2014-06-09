'use strict';

angular.module('personalApp.directives', [])

.directive('appdirNavigation', [
	'$http',
	'$compile',
	'$templateCache',
	function($http, $compile, $templateCache) {
		return {
			restrict: 'A',
			controller: 'NavCtrl',
			link: function(scope, iElement, iAttr) {
				console.log('hello', iAttr);
				$http.get('partials/navigation.html', {cache: $templateCache}).success(function(tplContent){
					iElement.append($compile(tplContent)(scope));
				});
			}
		};
	}
])

.directive('appdirIntroStripes', [
	'$compile',
	function($compile) {
		return {
			restrict: 'A',
			link: function(scope, iElement, iAttr) {
				console.log(scope.sections)
				var stripeClassName = iAttr.introStripeClass;
				var stripeInnerClassName = iAttr.introStripeClass+'-inner';
				var stripesCount = scope.sections.length;
				angular.forEach(scope.sections, function(k,v) {
					var stripe = angular.element(document.createElement('div'));
					var stripeInner = angular.element(document.createElement('div'));
					stripe.addClass(stripeClassName);
					stripeInner.addClass(stripeInnerClassName);
					stripe.append(stripeInner);
					iElement.append(stripe);
				});
			}
		};
	}
]);