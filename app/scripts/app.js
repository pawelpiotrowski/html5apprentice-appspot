'use strict';

angular.module('personalApp', [
	'ngRoute',
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
.config(function ($routeProvider) {
    var _view = function(tmpl) {
        var templatesDir = '/views/';
        var templates = {
            intro: templatesDir+'intro.html',
            section: templatesDir+'section.html',
            sectionDetail: templatesDir+'section-detail.html'
        };
        return (tmpl in templates) ? templates[tmpl] : templatesDir+tmpl;
    };
	$routeProvider
	.when('/',                 { templateUrl: _view('intro') })
	.when('/about',            { templateUrl: _view('section') })
	.when('/projects',         { templateUrl: _view('section') })
	.when('/projects/:id',     { templateUrl: _view('sectionDetail') })
	.when('/appendix',         { templateUrl: _view('section') })
	.when('/appendix/:name',   { templateUrl: _view('sectionDetail') })
    // .when('/blog',             { templateUrl: _view('section') })
	// .when('/blog/:slug',       { templateUrl: _view('sectionDetail') })
	.when('/test',             { templateUrl: _view('test.html') })
	.when('/404',              { templateUrl: '404.html' })
	.otherwise(                { redirectTo: '/404' });
});