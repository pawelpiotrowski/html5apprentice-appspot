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
    '$window',
    '$document',
    'AppfactConfig',
    'appSettings',
    function($window, $document, AppfactConfig, appSettings) {

        var _stateSlugs = appSettings.stateSlugs;
        var _stateCssSlugs = appSettings.stateCssSlugs;
        var _paletteSett = appSettings.palette;

        this.uniqueid = function() {
            var timeStamp = new Date().getTime();
            var randNumber = Math.round(Math.random() * 1000000);
            return timeStamp+'_'+randNumber;
        };
        this.extractPath = function(path) {

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

        this.paletteSectionTypeSlug = function(sectionRef) {
            //console.log(sectionRef);
            var _sections = AppfactConfig.getRoutedSections();
            var _section = (sectionRef < 0) ? false : _sections[sectionRef];
            var _paletteDefaultSlug = _paletteSett.sectionPaletteCssDefaultSlug;
            var _sectionDefaultSlug = !_section || _section.defaultPalette;
            var _paletteTypeSlug = (_sectionDefaultSlug) ? _paletteDefaultSlug : '-'+_section.type;

            return _paletteTypeSlug;
        };

        this.paletteCssClass = function(sectionRef) {

            var _paletteCssSlug = _stateCssSlugs.section + _paletteSett.sectionPaletteCssSlug;
            var _paletteType = this.paletteSectionTypeSlug(sectionRef);

            return _paletteCssSlug + _paletteType;
        };

        this.decorationCssClass = function(mainOrContra, decorationType, sectionRef) {
            var _decorationType = (decorationType === 'background') ? 'bckgd' : decorationType;
            var _paletteSlug = _paletteSett.sectionPaletteCssSlug.substring(1);
            var _includeSectionRef = '';
            if(angular.isDefined(sectionRef)) {
                _includeSectionRef = this.paletteSectionTypeSlug(sectionRef);
            }
            return _paletteSlug + _includeSectionRef + '-' + mainOrContra + '-' + _decorationType;
        };

        this.fontTracking = function() {
            window.MTIProjectId = 'c5c97bbb-4edc-42a1-853b-387cd1b12245';
            var mtiTracking = document.createElement('script');
            var trackingUrl = '//fast.fonts.net/t/trackingCode.js';
            var urlProtocol = ('https:' === document.location.protocol ? 'https:' : 'http:');
            var elToAppendTo = (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]);
            mtiTracking.type = 'text/javascript';
            mtiTracking.async = 'true';
            mtiTracking.src = urlProtocol + trackingUrl;
            elToAppendTo.appendChild(mtiTracking);
        };

        this.getWindowSize = function() {
            var w = $window,
                d = $document[0],
                e = d.documentElement,
                g = d.getElementsByTagName('body')[0],
                x = w.innerWidth || e.clientWidth || g.clientWidth,
                y = w.innerHeight|| e.clientHeight|| g.clientHeight;
            return {
                innerWidth: x,
                innerHeight: y
            };
        };

        this.getElementStyle = function(el) {
            var _el = el[0] || el;
            return $window.getComputedStyle(_el);
        };
    }
]);