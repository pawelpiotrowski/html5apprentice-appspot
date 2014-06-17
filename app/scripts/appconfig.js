'use strict';

angular.module('personalApp.appconfig', ['personalApp.logservice'])

.constant('appSettings', {
	colorNames: ['white', 'red', 'orange', 'blue', 'green', 'tan', 'dark'],
	colorPalette: ['#fffffc', '#dd1e2f', '#ebb035', '#06a2cb', '#218559', '#d0c6b1', '#192823'],
	contentPath: 'data/content.json',
	exludeSections: ['test', '404', 'null'],
	palette: {
		page: {
			bckgd: '#ffffff',
			color: '#000000'
		},
		sections: [
			{
				main: '#e56a1a',
				contra: '#ebc014'
			},
			{
				main: '#003380',
				contra: '#87aade'
			},
			{
				main: '#445500',
				contra: '#abc837'
			}
		]
	}
})

.factory('AppfactConfig', [
	'$http',
	'$q',
	'$route',
	'appSettings',
	function($http, $q, $route, settings) {
		
		// stores valid routes
		var _sections = [];
		// array of sections objects
		var	sections = [];
		// build sections from routes
		angular.forEach($route.routes, function(routeObj,routeVal) {
			// remove slashes
			var route = routeVal.replace(/\//g, '');
			// ignore child routes -> search for name:id
			var routeCheck = route.match(/[\:]/);
			// ignore sections
			var routeValidator = settings.exludeSections;
			// valid route conditions
			var validRoute = route.length && !routeCheck && _sections.indexOf(route) < 0 && routeValidator.indexOf(route) < 0;
			//console.log(validRoute);
			
			var validRouteRef = sections.length;
			if(validRoute) {
				//console.log('valid route', validRouteRef);
				_sections.push(route);
				sections.push({
					order: validRouteRef,
					slug: route,
					url: '#'+route,
					palette: settings.palette.sections[validRouteRef]
				});
			}
		});
		
		//console.log(sections);
		
		var getContent = function() {
			var deferred = $q.defer();
			$http.get(settings.contentPath).success(function(d) {
				deferred.resolve(d);
			}).error(function(d) {
				deferred.reject(['Get content error: ',d]);
			});
			return deferred.promise;
		};
				
		//API
		return {
			getContentPromise: getContent,
			getRoutedSections: function() {
				var d = [];
				return angular.extend(d,sections);
			}
		};
	}
])

.service('AppservConfig', [
	'appSettings',
	'AppservLog',
	function(settings, appservLog) {
		
		/* app palette log
		(function() {
			appservLog.log('info', 'APPLICATION PALETTE:');
			angular.forEach(settings.colorNames, function(k,v) {
				appservLog.log('log', { name: k, val: settings.colorPalette[v] });
			});
		})();
		*/
		
		this.getPallete = function() {
			var d = [];
			return angular.extend(d,settings.colorPalette);
		};
		this.getColors = function() {
			var d = [];
			return angular.extend(d,settings.colorNames);
		};
		this.getColorByArrPos = function(arrPos) {
			var _arrPos = arrPos - 1;
			if(_arrPos < 0 || _arrPos >= settings.colorPalette.length) {
				var warnmsg = 'Get app color out of range('+arrPos+' = '+_arrPos+'), returning (1): '+settings.colorNames[0]+' '+settings.colorPalette[0];
				appservLog.log('warn', warnmsg);
				_arrPos = 1;
			}
			return settings.colorPalette[_arrPos];
		};
	}
]);