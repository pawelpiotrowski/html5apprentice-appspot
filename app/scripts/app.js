'use strict';

angular.module('personalApp', [
	'ui.router',
	'ngAnimate',
	'personalApp.appconfig',
	'personalApp.appcontroller',
    'personalApp.apperror',
	'personalApp.appnavigation',
    'personalApp.appintro',
    'personalApp.appsection',
	'personalApp.apputils',
	'personalApp.dollmaker',
	'personalApp.dollhandcraft',
	'personalApp.logservice'
])
.config(function ($stateProvider, $urlRouterProvider, appSettings) {
    
    var _home = appSettings.stateSlugs.home;
    var _page404 = appSettings.stateSlugs.page404;
    var _section = appSettings.stateSlugs.section;
    var _sectionDetail = appSettings.stateSlugs.sectionDetail;
    var _templatesDir = appSettings.templatesDir;
    
    var _view = function(tmpl) {
        
        var templates = {};
        
        templates[_home] = _templatesDir+'intro.html';
        templates[_page404] = '404.html';
        templates[_section] = _templatesDir+'section.html';
        templates[_sectionDetail] = _templatesDir+'section-detail.html';
        
        return (tmpl in templates) ? templates[tmpl] : _templatesDir+tmpl;
    };
    
    $urlRouterProvider.when('', '/');
    
	$stateProvider
    
	.state(_home, {
		url: '/',
		templateUrl: _view(_home),
        controller: function($scope) {
            $scope.content = appSettings.homeContent;
        }
	})
    
    .state('about', {
        url: '/about',
		templateUrl: _view(_section)
	})
    
    .state('projects', {
        url: '/projects',
		templateUrl: _view(_section)
	})
	
	.state('projects.detail', {
        url: '/:id',
        templateUrl: _view(_sectionDetail)
    })
    
    .state('appendix', {
        url: '/appendix',
		templateUrl: _view(_section)
	})
	
	.state('appendix.detail', {
        url: '/:slug',
        templateUrl: _view(_sectionDetail)
    })
    
    .state('blog', {
        url: '/blog',
		templateUrl: _view(_section)
	})
	
	.state('blog.detail', {
        url: '/:entry',
        templateUrl: _view(_sectionDetail)
    })
    
    .state('test', {
        url: '/test',
		templateUrl: _view('test.html')
	})
    
    .state(_page404, {
        url: '/'+_page404,
		templateUrl: _view(_page404)
	});
    
    $urlRouterProvider.otherwise('/'+_page404);
});