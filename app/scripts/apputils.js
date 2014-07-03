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
])

.service('AppservUtils', [
    'AppfactConfig',
	function(AppfactConfig) {
		this.uniqueid = function() {
			var timeStamp = new Date().getTime();
			var randNumber = Math.round(Math.random() * 1000000);
			return timeStamp+'_'+randNumber;
		};
        this.extractPath = function(path) {
            var _sectionSlugs = AppfactConfig.getRoutedSlugs();
            var _cleanPath = path.replace(/\..*$/,'');
            var _matchSection = _sectionSlugs.indexOf(_cleanPath);
            
            var _isIndex = (path === 'intro');
            var _isCategory = (_matchSection >= 0);
            var _isSubcategory = (path !== _cleanPath);
            var _is404 = (path === 'not-found');
            var _viewClassName = '';
            var _sectionRef = -1;
            
            if(_isIndex) {
                _viewClassName = 'intro';
            } else if(_isCategory) {
                _viewClassName = (_isSubcategory) ? 'section-detail' : 'section';
                _sectionRef = _matchSection;
            } else if(_is404) {
                _viewClassName = 'not-found';
            }
            
            return {
                viewCssClass: _viewClassName,
                sectionReference: _sectionRef
            };
        };
        this.paletteCssClass = function(sectionRef) {
            var _sections = AppfactConfig.getRoutedSections();
            var _section = _sections[sectionRef];
            var _paletteType = (_section.defaultPalette) ? 'default' : _section.type;
            return 'section-palette-'+_paletteType;
        };
	}
]);