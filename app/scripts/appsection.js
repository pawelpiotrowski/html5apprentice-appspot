'use strict';

angular.module('personalApp.appsection', [])

.controller('SectionCtrl', [
    '$scope',
	'AppfactConfig',
    function($scope, AppfactConfig) {
        console.log('SECTION CTRL');
        var _sectionState = $scope.currentViewName;
        
        var _sectionContentRef = $scope.sectionsSlugs.indexOf(_sectionState);
        var _sectionContent = (_sectionContentRef < 0) ? $scope.appErr.handler('no-content') : $scope.sections[_sectionContentRef];
        
        $scope.isDetailView = function() {
            return angular.isUndefined($scope.currentState.toParams.slug);
        };
        
        $scope.mainBckgd = $scope.appUtils.decorationCssClass('main','background');
        $scope.mainBorder = $scope.appUtils.decorationCssClass('main','border');
        $scope.mainColor = $scope.appUtils.decorationCssClass('main','color');
        
        $scope.contraBckgd = $scope.appUtils.decorationCssClass('contra','background');
        $scope.contraBorder = $scope.appUtils.decorationCssClass('contra','border');
        $scope.contraColor = $scope.appUtils.decorationCssClass('contra','color');
        
        $scope.sectionContent = _sectionContent.payload;
		
		if(!$scope.sectionContent) {
			var populateContent = function(d) {
				
                // console.log(d);
                
                var _sc = {};
                _sc.sections = [];

                angular.forEach(d.items, function(item) {
                    _sc.sections[item.fields.sectionOrder] = {
                        name: item.fields.sectionName,
                        content: {
                            resources: {
                                items: {}
                            }
                        }
                    };
                });

                angular.forEach(d.includes.Entry, function(entry) {
                    // console.log(entry);
                    var _sArticle = entry.fields;
                    var _sectionRef = _sc.sections[_sArticle.sectionIdReference];
                    var _content = _sectionRef.content;
                    if(angular.isDefined(_sArticle.sectionArticleName)) {
                        _content.title = _sArticle.sectionArticleTitle;
                        _content.txt = _sArticle.sectionArticleText;
                    } else if(angular.isDefined(_sArticle.articleSlug)) {
                        _content.resources.items[_sArticle.articleSlug] = _sArticle;
                    }
                });

                angular.forEach($scope.sections, function(thisSection, sectionIndex) {
					thisSection.payload = _sc.sections[sectionIndex];
				});
                
				$scope.sectionContent = _sectionContent.payload;
                // console.log($scope.sectionContent);
                $scope.$emit('sectioncontent::loaded');
			};
			
			var checkForContent = AppfactConfig.contentReady();
			
			if(checkForContent) {
				populateContent(checkForContent);
			} else {
				AppfactConfig.getContentPromise().then(function(d) {
					console.log('*** Content promise in sectionctrl ***', d);
					populateContent(d);
				}, function(err) {
					$scope.appLog('warn', err);
				}, null);
			}
		}
		
    }
])

.controller('SectionDetailCtrl', [
    '$scope',
    '$rootScope',
    '$timeout',
    function($scope, $rootScope, $timeout) {
        console.log('SECTION DETAIL CTRL');
        $scope.detailContent = null;
        $scope.detailValid = false;
        
        var isContent = angular.isObject($scope.sectionContent);
        
        var noContent = function() {
            console.log('NO CONTENT :((');
        };

        var gotContent = function() {
            var urlRefSlug = $scope.currentState.toParams.slug;
            $scope.detailContent = $scope.sectionContent.content.resources.items[urlRefSlug];
            console.log($scope.detailContent);
            $scope.detailValid = true;
            $timeout(function() {
                $rootScope.$broadcast('sectioncontent::refresh');
            }, 10);
        };
        
        var checkContent = function() {
            
            var urlRef = $scope.currentState.toParams;
            
            // shortcut
            var isObj = function(_obj) {
                return angular.isObject(_obj);
            };
            
            var contentHasResources = isObj($scope.sectionContent.content.resources);
            
            var contentHasItems = (contentHasResources) ? isObj($scope.sectionContent.content.resources.items) : false;
            
            if(contentHasResources && contentHasItems) {
                var items = $scope.sectionContent.content.resources.items;
                var urlValid = angular.isDefined(urlRef.slug);
                var urlRefValid = (urlValid) ? (urlRef.slug in items) : false;
                if(urlValid && urlRefValid) {
                    gotContent();
                } else {
                    noContent();
                }
            } else {
                noContent();
            }
        };
        
        if(isContent) {
            checkContent();
        } else {
            $rootScope.$on('sectioncontent::loaded', function() {
                checkContent();
            });
        }
    }
])

.directive('appdirSectionLoading', [
    function() {
        return {
            restrict: 'A',
            link: function(scope) {
                scope.contentLoaded = angular.isObject(scope.sectionContent);
                scope.$on('sectioncontent::loaded', function() {
                    scope.contentLoaded = true;
                });
            }
        };
    }
]);