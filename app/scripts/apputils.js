'use strict';

angular.module('personalApp.apputils', [])

.factory('AppfactPrefix', [
	function() {
		var styles = window.getComputedStyle(document.documentElement, ''),
			pre = (Array.prototype.slice .call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']) )[1],
			dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1],
			csstransend = (pre === 'webkit') ? 'webkitTransitionEnd' : 'transitionend';
		//API
		return {
			dom: dom,
			lowercase: pre,
			css: '-' + pre + '-',
			js: pre[0].toUpperCase() + pre.substr(1),
			cssAnimationEnd: csstransend
		};
	}
]);