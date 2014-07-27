/*
 * angular-markdown-directive v0.3.0
 * (c) 2013-2014 Brian Ford http://briantford.com
 * modified version - adds classes to tags
 * License: MIT
 */

'use strict';

angular.module('personalApp.appmarkdown', ['ngSanitize'])

.provider('markdownConverter', function() {
    var opts = {};
    return {
        config: function(newOpts) {
            opts = newOpts;
        },
        $get: function() {
            return new Showdown.converter(opts);
        }
    };
})

.directive('appdirMarkdown', [
    '$sanitize',
    '$timeout',
    'markdownConverter',
    function($sanitize, $timeout, markdownConverter) {
        return {
            restrict: 'AE',
            link: function(scope, element, attrs) {

                var addStyle = function() {
                    
                    // titles
                    element.find('h2').addClass(scope.mainColor);
                    
                    // links
                    var links = element.find('a');
                    links.addClass(scope.contraColor);
                    angular.forEach(links, function(_link) {
                        if(_link.hash === '#article') {
                            
                            var linkTitle = _link.title;
                            var currSection = scope.currentViewName;
                            var hashLink = angular.element(_link);
                            var hashLinkHref = '#/'+currSection+'/'+linkTitle;
                            
                            hashLink.removeAttr('title');
                            hashLink.attr('href', hashLinkHref);
                            
                        }
                    });
                    
                    // images
                    var imgs = element.find('img');
                    angular.forEach(imgs, function(_img) {
                        var img = angular.element(_img);
                        var imgHeight = _img.height;
                        var imgWidth = _img.width;
                        var imgTitle = _img.title;
                        var imgOrientation = (imgWidth > imgHeight) ? 'img-landscape' : 'img-portrait';
                        var imgWrapClass = scope.mainBckgd+' '+imgOrientation;
                        if(imgTitle.length && _img.nextSibling) {
                            img.removeAttr('title');
                            angular.element(_img.nextSibling).wrap('<div class="img-caption">');
                            imgWrapClass += ' img-width-caption';
                        }
                        img.wrap('<div class="img-wrap '+imgWrapClass+'">');
                        img.on('load', function() {
                            console.log('image loaded');
                            $timeout(function() {
                                scope.$emit('sectioncontent::refresh');
                            }, 10);
                        });
                    });
                };

                if(attrs.appdirMarkdown) {
                    scope.$watch(attrs.appdirMarkdown, function(newVal) {
                        var html = newVal ? $sanitize(markdownConverter.makeHtml(newVal)) : '';
                        element.html(html);
                        addStyle();
                    });
                } else {
                    var html = $sanitize(markdownConverter.makeHtml(element.text()));
                    element.html(html);
                    addStyle();
                }
            }
        };
    }
]);