'use strict';

angular.module('personalApp.dollmaker', [])

.directive('appdirMakeNavDoll', [
	'AppfactDoll',
	function(AppfactDoll) {
		return {
			restrict: 'A',
			link: function(scope, iElement) {
				//console.log(scope, iElement, iAttr);
				var navDollCounter = scope.$index;
				var navDollRaphael = new Raphael(iElement[0]);
				var navDollSize = navDollCounter + 1;
				function navDollClick() {
					console.log('clicked');
					navDoll.action('click', navDollClick, false);
				}
				var navDoll = new AppfactDoll(
					navDollRaphael,
					navDollSize,
					{
						basePath: scope.sections[navDollCounter].palette.contra,
						headPath: scope.sections[navDollCounter].palette.main,
						bellyPath: scope.sections[navDollCounter].palette.main
					}
				);
				navDoll.make();
				navDoll.action('click', navDollClick, true);
			}
		};
	}
])

.factory('AppfactDoll', [
	'AppservDoll',
	function(AppservDoll) {
		return function(doll, dollsize, colors) {
			this.el = doll;
			this.scale = 1 - dollsize / 10;
			this.pathColors = (colors) ? colors : {};
			this.dollShape = null;
			this.dollPaths = {};
			this.make = function() {
				
				var doll = this.el;
				var	dollRef = AppservDoll.paths;
				var	dollRoot = this;
				
				doll.setStart();
				
				angular.forEach(AppservDoll.pathOrder, function(pathName) {
					var thisPath = dollRef[pathName];
					dollRoot.dollPaths[pathName] = doll.path(thisPath.path)
					.attr('fill', (thisPath.name in dollRoot.pathColors) ? dollRoot.pathColors[thisPath.name] : thisPath.color);
					thisPath.make(dollRoot.dollPaths[pathName]);
				});
				
				//doll.setViewBox(0, 0, this.svgSize.w * this.divider, this.svgSize.h * this.divider, true);
				doll.setViewBox(0, 0, AppservDoll.svgSize.w, AppservDoll.svgSize.h, true);
				//doll.setSize('100%', '100%');
				doll.canvas.setAttribute('preserveAspectRatio', 'xMidYMax');
				
				this.dollShape = doll.setFinish();
				this.dollShape.scale(this.scale,this.scale,AppservDoll.svgSize.w / 2, AppservDoll.svgSize.h);
				
				//console.log(this.dollPaths);
				//console.log(this.dollShape);
			};
			this.action = function(eName, eHandler, addOrRemove) {
				switch(eName) {
					case 'click':
						if(addOrRemove) {
							this.dollShape.click(eHandler);
						} else {
							this.dollShape.unclick(eHandler);
						}
						break;
				}
			};
		};
	}
])

.service('AppservDoll', [
	function() {
		this.svgSize = {
			h: 254,
			w: 134
		};
		this.paths = {
			basePath: {
				name: 'basePath',
				color: '#ECC117',
				path: 'M66.384,4.445c-33.021,0.44-39.297,27.441-39.297,54.79 c0.192,22.427-20.81,34.056-20.81,55.662c0,0-2.566,23.821,0,35.086c5.212,22.879,13.528,51.22,25.876,68.961 c-7.27,3.925-11.574,8.787-11.574,13.361c0,9.898,20.111,17.256,46.923,17.256s46.922-7.357,46.922-17.256 c0-4.822-4.775-9.975-12.776-14c12.822-17.626,22.274-45.285,26.994-68.322c2.332-11.375-2.152-35.086-2.152-35.086 c-1.693-27.546-20.877-35.705-20.808-55.662C105.681,31.886,99.399,4.005,66.384,4.445L66.384,4.445z',
				make: function(dollpath) {
					dollpath.attr({
						'id': this.name,
						'connector-curvature': '0',
						'stroke-width': '0',
						'stroke-opacity': '1'
					})
					.data('id', this.name);
				}
			},
			headPath: {
				name: 'headPath',
				color: '#E56A19',
				path: 'M66.365,4.354c-33.021,0.44-39.297,27.44-39.297,54.788 c0.078,9.069-3.309,16.371-7.372,23.282c12.113,9.522,28.931,13.284,47.516,13.284c20.003,0,34.019-2.804,47.369-13.141 c-4.327-6.878-8.952-13.566-8.918-23.425C105.662,31.794,99.38,3.915,66.365,4.354L66.365,4.354z',
				make: function(dollpath) {
					dollpath.attr({
						'id': this.name,
						'connector-curvature': '0',
						'stroke-width': '0',
						'stroke-opacity': '1'
					})
					.data('id', this.name);
				}
			},
			bellyPath: {
				name: 'bellyPath',
				color: '#E56A19',
				path: 'M6.633,151.474 c5.23,22.609,13.438,50.107,25.521,67.467c-3.319,1.793-6.009,3.779-7.965,5.846c9.312,7.344,22.699,11.591,41.924,11.591 c20.361,0,34.166-4.708,43.517-12.759c-2.074-1.891-4.764-3.703-7.981-5.322c12.545-17.246,21.854-44.074,26.671-66.803 C123.485,174.275,12.702,173.67,6.633,151.474L6.633,151.474z',
				make: function(dollpath) {
					dollpath.attr({
						'id': this.name,
						'connector-curvature': '0',
						'stroke-width': '0',
						'stroke-opacity': '1',
						'nodetypes': 'cccsccccc'
					})
					.data('id', this.name);
				}
			}
		};
		this.pathOrder = [
			'basePath',
			'headPath',
			'bellyPath'/*,
			'leftHandPath',
			'rightHandPath',
			'leftArmPath',
			'rightArmPath',
			'bowPath',
			'facePath',
			'leftCheekPath',
			'rightCheekPath',
			'leftEyeBrowPath',
			'rightEyeBrowPath',
			'hairPath',
			'leftEyeLashPath',
			'rightEyeLashPath',
			'leftEyePath',
			'rightEyePath',
			'nosePath',
			'lipsPath',
			'leafSouthPath1',
			'leafSouthPath2',
			'leafSouthPath3',
			'leafEastPath1',
			'leafEastPath2',
			'leafEastPath3',
			'leafNorthPath1',
			'leafNorthPath2',
			'leafNorthPath3',
			'leafWestPath1',
			'leafWestPath2',
			'leafWestPath3',
			'flowerNorthPath1',
			'flowerNorthPath2',
			'flowerNorthPath3',
			'flowerNorthPath4',
			'flowerNorthPath5',
			'flowerSouthPath1',
			'flowerSouthPath2',
			'flowerSouthPath3',
			'flowerSouthPath4',
			'flowerSouthPath5'*/
		];
	}
]);