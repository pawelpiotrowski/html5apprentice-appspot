'use strict';

angular.module('personalApp.appconfig', ['personalApp.logservice'])

.constant('appSettings', {
	contentPath: 'http://cdn.contentful.com/spaces/hbdg3afnrqv7/entries?content_type=204FqWl3MAcAosq0gMoKKm&access_token=2b9e567ba1502393bee07289559bdcb852a9349202178a3e6c0ba7a523067e62',
    templatesDir: 'views/',
    partialsDir: 'partials/',
	exludeSections: ['test', 'not-found'],
	palette: {
		page: {
			bckgd: '#fffffc',
			color: '#192823'
		},
		sections: [
			{
				main: '#680420',
				contra: '#eb2228',
				extension: [
					'#241c1c',
					'#29190F',
					'#320E10',
					'#2D2727',
					'#ab0613'
				]
			},
			{
				main: '#445500',
				contra: '#abc837',
				extension: [
					'#c87137',
					'#320E10',
					'#546315',
					'#320E10',
					'#eb2228'
				]
			},
			{
				main: '#003380',
				contra: '#87aade',
				extension: [
					'#fdd001',
					'#502D17',
					'#164450',
					'#502D17',
					'#da2d6e'
				]
			}
		],
		sectionDefaultPalette: {
			main: '#e56a1a',
			contra: '#ebc014',
			extension: [
				'#3b0208', // hair
				'#502D17', // eyebrow
				'#29190F', // eye
				'#D45714', // nose
				'#D45714' // lips
			]
		},
        sectionPaletteCssSlug: '-palette',
        sectionPaletteCssDefaultSlug: '-default'
	},
    stateSlugs: {
        home: 'intro',
        page404: 'not-found',
        section: 'section',
        sectionDetail: '-detail'
    },
    stateCssSlugs: {
        home: 'intro',
        page404: 'not-found',
        section: 'section',
        sectionDetail: '-detail',
        sectionActive: 'active',
        mobileNavOn: 'mobile-nav-on',
        mobileNavOpen: 'mobile-nav-open'
    },
    homeContent: {
        line1: 'Hey, how are you? My name is Pawel',
        line2: 'I am a web developer',
        line3: 'and this is how I rock.'
    },
    globalTransitionMsTime: 600,
    pageLayoutLeft: '20%',
    pageLayoutRight: '10%'
})

.factory('AppfactConfig', [
	'$http',
	'$q',
    '$state',
	'appSettings',
	function($http, $q, $state, appSettings) {
        
        var appStates = $state.get();
		// stores valid routes
		var _sections = [];
		// array of sections objects
		var	sections = [];
		// build sections from routes
        angular.forEach(appStates, function(appState) {
            
            // remove slashes or make empty string expecting "/" or "^"
            var route = appState.url.substring(1);
            // ignore detail (nested) routes -> /:something
            var childRouteCheck = route.match(/[\:]/);
            // ignore sections
            var routeValidator = appSettings.exludeSections;
            // valid route conditions
            var validRoute = route.length && !childRouteCheck && _sections.indexOf(route) < 0 && routeValidator.indexOf(route) < 0;
            
            var validRouteRef = sections.length;
            
			if(validRoute) {
				var _p = appSettings.palette.sections[validRouteRef];
                var _palette = appSettings.palette.sectionDefaultPalette;
                var _defaultPalette = true;
                if(_p) {
                    _palette = _p;
                    _defaultPalette = false;
                }
                var _cattype = validRouteRef + 1;
				_sections.push(route);
				sections.push({
					order: validRouteRef,
                    type: _cattype,
					slug: route,
                    defaultPalette: _defaultPalette,
					palette: _palette,
                    payload: null
				});
			}
        });
        
		// console.log(sections);
		var _sectionContent = null;
		
		var contentReady = function() {
			return _sectionContent;
		};
        
        var contentPopulate = function(data) {
            console.log('*** Content populate ***', data);
            if(angular.isObject(data)) {
                _sectionContent = data;
            } else {
                // content fetching error()    
            }
        };
        
		// $http.defaults.useXDomain = true;
		
		var getContentPromise = function() {
			return $http.get(appSettings.contentPath)
			.then(
				function(d) {
					contentPopulate(d.data);
                    return contentReady();

				},
				function(d) {
					// something went wrong
					return $q.reject(d);
				}
			);
		};
		
		var fetchContent = function() {
			$http.get(appSettings.contentPath).success(function(d) {
				contentPopulate(d);
			}).error(function(d) {
				console.log('Fetching content error', d);
			});
		};
		
		//API
		return {
			contentReady: contentReady,
			fetchContent: fetchContent,
			getContentPromise: getContentPromise,
            getRoutedSlugs: function() {
                return angular.extend([],_sections);
            },
			getRoutedSections: function() {
				return angular.extend([],sections);
			}
		};
	}
]);