'use strict';

angular.module('personalApp.appconfig', ['personalApp.logservice'])

.constant('appSettings', {
	contentPath: 'http://datatest.local/',
    templatesDir: '/views/',
    partialsDir: '/partials/',
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
        sectionActive: 'active'
    },
    homeContent: {
        line1: 'Hello my name is Pawel and I make',
        line2: 'handcrafted html, css',
        line3: 'and javascript.'
    }
})

.factory('AppfactConfig', [
	'$http',
	'$q',
    '$state',
	'appSettings',
	function($http, $q, $state, settings) {
        
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
            var routeValidator = settings.exludeSections;
            // valid route conditions
            var validRoute = route.length && !childRouteCheck && _sections.indexOf(route) < 0 && routeValidator.indexOf(route) < 0;
            
            var validRouteRef = sections.length;
            
			if(validRoute) {
				var _p = settings.palette.sections[validRouteRef];
                var _palette = settings.palette.sectionDefaultPalette;
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
		// $http.defaults.useXDomain = true;
		
		var getContent = function() {
			return $http.get(settings.contentPath)
			.then(
				function(d) {
					if (typeof d === 'object') {
						_sectionContent = d.data;
						return _sectionContent;
					} else {
						// invalid response
						return $q.reject(d);
					}

				},
				function(d) {
					// something went wrong
					return $q.reject(d);
				}
			);
		};
		
		var fetchContent = function() {
			$http.get(settings.contentPath).success(function(d) {
				console.log(d);
				_sectionContent = d;
			}).error(function(d) {
				console.log('Fetching content error', d);
			});
		};
		
		//API
		return {
			contentReady: contentReady,
			fetchContent: fetchContent,
			getContentPromise: getContent,
            getRoutedSlugs: function() {
                return angular.extend([],_sections);
            },
			getRoutedSections: function() {
				return angular.extend([],sections);
			}
		};
	}
]);