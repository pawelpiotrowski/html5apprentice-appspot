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
])

.filter('appfiltContentful', function() {
    return function(contentStringIn) {
        
        var tagsCollection = [
            {
                findRegex: /\*\*/gi, // **
                regexLength: 2,
                replaceStartTag: '<strong>',
                replaceEndTag: '</strong>'
            },
            {
                findRegex: /\*/gi, // *
                regexLength: 1,
                replaceStartTag: '<em>',
                replaceEndTag: '</em>'
            }
        ];
        
        var titlesCollection = [
            {
                findRegexStart: /&#10\;# /gi, // &#10;#[space]
                findRegexEnd: /&#10\;/gi,
                regexStartLength: 7,
                regexEndLength: 5,
                replaceStartTag: '<h2>',
                replaceEndTag: '</h2>'
            },
            {
                findRegexStart: /&#10\;## /gi, // &#10;##[space]
                findRegexEnd: /&#10\;/gi,
                regexStartLength: 8,
                regexEndLength: 5,
                replaceStartTag: '<h3>',
                replaceEndTag: '</h3>'
            },
            {
                findRegexStart: /&#10\;### /gi, // &#10;###[space]
                findRegexEnd: /&#10\;/gi,
                regexStartLength: 9,
                regexEndLength: 5,
                replaceStartTag: '<h4>',
                replaceEndTag: '</h4>'
            }
        ];
        
        var listsCollection = [
            {
                findRegexStart: /&#10\;- /gi, // &#10;-[space]
                findRegexEnd: /&#10\;/gi,
                findRegexPart: /- /gi,
                regexStartLength: 7,
                regexEndLength: 5,
                regexPartLength: 2,
                replaceStartTagWrap: '<ul>',
                replaceEndTagWrap: '</ul>',
                replaceStartTag: '<li>',
                replaceEndTag: '</li>'
            }
        ];
        
        contentStringIn = contentStringIn || '';
        
        var contentStringOut = contentStringIn;
        var stringLength = contentStringOut.length;
        
        // em = * & strong = **
        var replaceTag = function(tag) {
            var regex = tag.findRegex, result, counter = 0;
            while((result = regex.exec(contentStringOut))) {
                counter++;
                var _counterOdd = counter % 2;
                var _htmlReplacer = (_counterOdd) ? tag.replaceStartTag : tag.replaceEndTag;
                var _ri = result.index;
                var _cspart1 = contentStringOut.substr(0,_ri);
                var _cspart2 = contentStringOut.substr(_ri + tag.regexLength, stringLength);
                contentStringOut = _cspart1 + _htmlReplacer + _cspart2;
            }
        };
        
        var replaceTitle = function(title) {
            
            var regexStart = title.findRegexStart;
            var regexEnd = title.findRegexEnd;
            var startTag = title.replaceStartTag;
            var endTag = title.replaceEndTag;
            var startLength = title.regexStartLength;
            var endLength = title.regexEndLength;
            var resultStart, resultEnd;
            
            while((resultStart = regexStart.exec(contentStringOut))) {
                
                var _riStart = resultStart.index;
                var _csStart1 = contentStringOut.substr(0,_riStart);
                var _csStart2 = contentStringOut.substr(_riStart + startLength, stringLength);
                
                resultEnd = regexEnd.exec(_csStart2);
                
                var _riEnd = resultEnd.index;
                var _csEnd1 = _csStart2.substr(0,_riEnd);
                var _csEnd2 = _csStart2.substr(_riEnd + endLength, stringLength);
                
                contentStringOut = _csStart1 + startTag + _csEnd1 + endTag + _csEnd2;
                
            }
        };
        
        var replaceList = function(list) {
            var regexStart = list.findRegexStart;
            var regexEnd = list.findRegexEnd;
            var regexPart = list.findRegexPart;
            var resultStart, resultEnd, counter = 0;
            var contentStringOutRaw = contentStringOut;
            var stringLengthRaw = contentStringOutRaw.length;
            var nextIsTagRegex = /</gi;
            while((resultStart = regexStart.exec(contentStringOutRaw))) {
                counter++;
                var openingTag = list.replaceStartTag;
                var closingTag = list.replaceEndTag + list.replaceEndTagWrap;
                
                if(counter === 1) {
                    console.log('################');
                    openingTag = list.replaceStartTagWrap + list.replaceStartTag;
                }
                
                var _riStart = resultStart.index;
                var _csStart1 = contentStringOutRaw.substr(0,_riStart);
                var _csStart2 = contentStringOutRaw.substr(
                    _riStart + list.regexStartLength, _riStart + stringLengthRaw
                );
                /*
                var otherTag = nextIsTagRegex.exec(_csStart2);
                var otherTagIndex = (otherTag) ? otherTag.index : -1;
                var closingTag = regexEnd.exec(_csStart2);
                var closingTagIndex = (closingTag) ? closingTag.index : -1;
                
                if(closingTag >= 0 && otherTag >= 0) {
                    if(otherTagIndex < closingTagIndex) {
                        var _riEnd = otherTagIndex;
                        var _csEnd1 = _csStart2.substr(0,_riEnd);
                        var _csEnd2 = _csStart2.substr(_riEnd, stringLength);
                        contentStringOutRaw = _csStart1 + openingTag + _csEnd1 + closingTag + _csEnd2;
                        counter = 0;
                    } else {
                        if()
                    }
                }
                console.log('****');
                */
                console.log(_csStart2);
                
                //console.log(otherTagIndex);
                //console.log(closingTagIndex);
                console.log('****');
                /*
                if(otherTagIndex === closingTagIndex) {
                    contentStringOutRaw = _csStart1 + openingTag + _csStart2 + closingTag
                }
                
                contentStringOut = contentStringOutRaw
                */
                /*
                
                var otherTag = nextIsTagRegex.exec(_csStart2);
                var closingTag = regexEnd.exec(_csStart2);
                var listEnd = list.findRegexPart.exec(_csStart2);
                var isListEnd = (listEnd) ? listEnd.index : -1;
                var endLength = (otherTag) ? 1 : list.regexEndLength;
                
                resultEnd = otherTag || closingTag;
                
                var _riEnd = resultEnd.index;
                var _csEnd1 = _csStart2.substr(0,_riEnd);
                var _csEnd2 = _csStart2.substr(_riEnd + endLength, stringLength);
                
                contentStringOut = _csStart1 + startTag + _csEnd1 + endTag + _csEnd2;
                
                if(closingTag && isListEnd === closingTag.index + list.regexEndLength) {
                    closingTag = list.replaceEndTag;
                }
                */
                
                /*
                if(counter === 1) {
                    contentStringOutRaw = _csStart1 + list.replaceStartTagWrap + list.replaceStartTag + _csStart2;
                } else {
                    
                }
                //console.log(counter);
                var nextIsListEnd = regexEnd.exec(_csStart2);
                var nextIsListEndCheck = regexPart.exec(_csStart2);
                console.log(resultStart.index);
                //console.log(nextIsListEnd);
                //console.log(nextIsListEndCheck);
                if(nextIsListEnd) {
                    console.log(nextIsListEnd.index);
                    console.log(nextIsListEndCheck);    
                }
                var nextIsListItem = regexStart.exec(_csStart2);
                var nextIsListEnd = regexEnd.exec(_csStart2);
                console.log(nextIsListItem, '******', nextIsListEnd);
                */
                /*
                var _counterOdd = counter % 2;
                var _htmlReplacer = (_counterOdd) ? tag.replaceStartTag : tag.replaceEndTag;
                var _ri = result.index;
                var _cspart1 = contentStringOut.substr(0,_ri);
                var _cspart2 = contentStringOut.substr(_ri + tag.regexLength, _ri + stringLength);
                contentStringOut = _cspart1 + _htmlReplacer + _cspart2;
                */
            }
        };
        
        angular.forEach(tagsCollection, function(_tag) {
            replaceTag(_tag);
        });
        
        angular.forEach(titlesCollection, function(_title) {
            replaceTitle(_title);
        });
        
        angular.forEach(listsCollection, function(_list) {
            replaceList(_list);
        });
        
        console.log(contentStringOut);
        return contentStringOut;
    };
});