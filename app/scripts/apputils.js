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
    'appSettings',
	function(AppfactConfig, appsettings) {
        
        var _stateSlugs = appsettings.stateSlugs;
        var _stateCssSlugs = appsettings.stateCssSlugs;
        var _paletteSett = appsettings.palette;
        
		this.uniqueid = function() {
			var timeStamp = new Date().getTime();
			var randNumber = Math.round(Math.random() * 1000000);
			return timeStamp+'_'+randNumber;
		};
        this.extractPath = function(path) {
            console.log(appsettings);
            console.log(path);
            var _sectionSlugs = AppfactConfig.getRoutedSlugs();
            var _homeSlug = _stateSlugs.home;
            var _page404Slug = _stateSlugs.page404;
            var _cleanPath = path.replace(/\..*$/,'');
            var _matchSection = _sectionSlugs.indexOf(_cleanPath);
            
            var _isIndex = (path === _homeSlug);
            var _isCategory = (_matchSection >= 0);
            var _isSubcategory = (path !== _cleanPath);
            var _is404 = (path === _page404Slug);
            var _viewClassName = '';
            var _sectionRef = -1;
            
            var _homeCssSlug = _stateSlugs.home;
            var _sectionCssSlug = _stateCssSlugs.section;
            var _sectionDetailsCssSlug = _sectionCssSlug + _stateCssSlugs.sectionDetail;
            var _page404CssSlug = _stateSlugs.page404;
            
            if(_isIndex) {
                _viewClassName = _homeCssSlug;
            } else if(_isCategory) {
                _viewClassName = (_isSubcategory) ? _sectionDetailsCssSlug : _sectionCssSlug;
                _sectionRef = _matchSection;
            } else if(_is404) {
                _viewClassName = _page404CssSlug;
            }
            
            return {
                viewCssClass: _viewClassName,
                sectionReference: _sectionRef
            };
        };
        
        this.paletteCssClass = function(sectionRef) {
            
            var _sections = AppfactConfig.getRoutedSections();
            var _section = _sections[sectionRef];
            var _paletteCssSlug = _stateCssSlugs.section + _paletteSett.sectionPaletteCssSlug;
            var _paletteDefaultCssSlug = _paletteSett.sectionPaletteCssDefaultSlug;
            var _paletteType = (_section.defaultPalette) ? _paletteDefaultCssSlug : '-'+_section.type;
            
            return _paletteCssSlug + _paletteType;
        };
        
        this.decorationCssClass = function(mainOrContra, decorationType) {
            var _decorationType = (decorationType === 'background') ? 'bckgd' : decorationType;
            var _paletteSlug = _paletteSett.sectionPaletteCssSlug.substring(1);
            return _paletteSlug + '-' + mainOrContra + '-' + _decorationType;
        };
	}
]);