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
				
                console.log(d);
                
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
                    console.log(entry);
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
                
                console.log($scope.sections);
				$scope.sectionContent = _sectionContent.payload;
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
    function($scope) {
        console.log('SECTION DETAIL CTRL ', $scope);
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