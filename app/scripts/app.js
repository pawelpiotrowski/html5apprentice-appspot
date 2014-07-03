'use strict';

angular.module('personalApp', [
	'ui.router',
	'ngAnimate',
	'personalApp.appconfig',
	'personalApp.appcontroller',
	'personalApp.appnavigation',
    'personalApp.appintro',
    'personalApp.appsection',
	'personalApp.apputils',
	'personalApp.dollmaker',
	'personalApp.dollhandcraft',
	'personalApp.logservice'
])
.config(function ($stateProvider, $urlRouterProvider) {
    
    var _view = function(tmpl) {
        var templatesDir = '/views/';
        var templates = {
            intro: templatesDir+'intro.html',
            section: templatesDir+'section.html',
            sectionDetail: templatesDir+'section-detail.html'
        };
        return (tmpl in templates) ? templates[tmpl] : templatesDir+tmpl;
    };
    
	$urlRouterProvider.otherwise('/not-found');
    
    $stateProvider
    
	.state('intro', {
		url: '/',
		templateUrl: _view('intro')
	})
    
    .state('about', {
        url: '/about',
		templateUrl: _view('section')
	})
    
    .state('projects', {
        url: '/projects',
		templateUrl: _view('section')
	})
	
	.state('projects.detail', {
        url: '/:id',
        templateUrl: _view('sectionDetail')
    })
    
    .state('appendix', {
        url: '/appendix',
		templateUrl: _view('section')
	})
	
	.state('appendix.detail', {
        url: '/:slug',
        templateUrl: _view('sectionDetail')
    })
    /*
    .state('blog', {
        url: '/blog',
		templateUrl: _view('section')
	})
	
	.state('blog.detail', {
        url: '/:entry',
        templateUrl: _view('sectionDetail')
    })
    */
    .state('test', {
        url: '/test',
		templateUrl: _view('test.html')
	})
    
    .state('not-found', {
        url: '/not-found',
		templateUrl: '404.html'
	});
    
});