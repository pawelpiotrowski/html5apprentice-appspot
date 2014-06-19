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
					//navDoll.action('click', navDollClick, false);
					//navDoll.animatePath(navDoll.dollPaths.lipsPath, null);
					navDoll.kiss();
				}
				var navDoll = new AppfactDoll(
					navDollRaphael,
					navDollSize,
					{
						basePath: scope.sections[navDollCounter].palette.contra,
						headPath: scope.sections[navDollCounter].palette.main,
						bellyPath: scope.sections[navDollCounter].palette.main,
						bowPath: scope.sections[navDollCounter].palette.main,
						hairPath: scope.sections[navDollCounter].palette.extension[0]
					}
				);
				navDoll.make();
				navDoll.action('click', navDollClick, true);
				//console.log(navDoll.dollPaths.lipsPath.attrs.path[0].toString());
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
			this.animated = false;
			this.make = function() {

				var doll = this.el;
				var	dollRef = AppservDoll.paths;
				var	dollRoot = this;
				var htmlEl = angular.element(document.getElementsByTagName('html')[0]);
				var addCursorClass = function() {
					htmlEl.addClass('cursor-pointer');
				};
				var removeCursorClass = function() {
					htmlEl.removeClass('cursor-pointer');
				};

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
				this.dollShape.hover(addCursorClass,removeCursorClass);
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
			this.kiss = function() {

				if(!this.animated) {
					console.log('inside');
					this.animated = true;
					var that = this;
					var animationEase = 'linear';
					var animationRef = AppservDoll.animationPaths.kiss;
					var animationPathLast = animationRef.length - 1;

					angular.forEach(animationRef, function(aPath, pathIndex) {

						var originPath = that.dollPaths[aPath.reference];
						var pathAttr = originPath.attrs.path;
						var pathString = AppservDoll.getPathsString(pathAttr);
						var kissingPath = aPath.path;

						var kissFinished = function() {
							that.animated = false;
							console.log('KISSED! :*');
						};
						
						var _kissFinished = (pathIndex === animationPathLast) ? kissFinished : null;

						var kissOut = Raphael.animation({ path: pathString }, 350, animationEase, _kissFinished);


						var kissOutClbk = function() {
							originPath.animate(kissOut.delay(500));
						};
						var kissIn = Raphael.animation({ path: kissingPath }, 200, animationEase, kissOutClbk);
						originPath.animate(kissIn);
					});
				}
			};
		};
	}
])

.service('AppservDoll', [
	function() {
		this.getPathsString = function(pathsArray) {
			var pathsString = '';
			angular.forEach(pathsArray, function(p) {
				pathsString += p.toString()+' ';
			});
			return pathsString;
		};
		this.svgSize = {
			h: 254,
			w: 134
		};
		this.animationPaths = {
			kiss: [
				{
					reference: 'lipsPath',
					path: 'M57.1865,72.9438 c4.0938,4.8081,2.2256,4.8149,9.1621,4.8706c7.0986-0.0732,5.9316-0.4062,9.1616-4.8706c-6.855-3.1934-3.8799-5.001-8.8281-3.4243 C61.1938,67.9717,64.499,70.0332,57.1865,72.9438z'
				},
				{
					reference: 'leftEyePath',
					path: 'M60.1069,53.585c0-1.1533-1.8389-1.085-4.1035-1.085 c-2.2656,0-4.1045-0.0684-4.1045,1.085c0,1.1523,1.8389,2.0952,4.1045,2.0952C58.2681,55.6802,60.1069,54.7373,60.1069,53.585z'
				},
				{
					reference: 'rightEyePath',
					path: 'M80.2319,53.585c0-1.1533-1.8389-1.085-4.1035-1.085c-2.2656,0-4.1045-0.0684-4.1045,1.085c0,1.1523,1.8389,2.0952,4.1045,2.0952C78.3931,55.6802,80.2319,54.7373,80.2319,53.585z'
				}
			]
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
			},
			leftHandPath: {
				name: 'leftHandPath',
				color: '#FDE5D6',
				path: 'M18.461,166.35c-2.8,0-5.396,0.705-7.592,1.896 c2.053,7.375,4.394,14.861,7.071,22.052c0.165,0.005,0.355,0.021,0.521,0.021c7.809,0,10.27-9.51,10.27-16.127 C28.731,167.576,26.27,166.35,18.461,166.35z',
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
			rightHandPath: {
				name: 'rightHandPath',
				color: '#FDE5D6',
				path: 'M116.709,166.35c2.8,0,5.396,0.705,7.592,1.896 c-2.053,7.375-4.423,14.861-7.101,22.052c-0.165,0.005-0.325,0.021-0.491,0.021c-7.808,0-10.27-9.51-10.27-16.127 C106.44,167.576,108.902,166.35,116.709,166.35z',
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
			leftArmPath: {
				name: 'leftArmPath',
				color: '#FAF3EE',
				path: 'M15.181,89.893c-4.66,7.574-8.943,15.274-8.943,24.996 c0,0-2.566,23.828,0,35.094c1.61,7.07,3.531,14.656,5.762,22.295c0.897,0.036,1.808,0.061,2.745,0.061 c25.183-0.188,15.898-30.636,16.268-54.829C31.012,105.93,24.818,90.324,15.181,89.893z',
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
			rightArmPath: {
				name: 'rightArmPath',
				color: '#FAF3EE',
				path: 'M118.875,90.01c4.66,7.574,10.019,15.156,10.019,24.878 c0,0,2.566,23.828,0,35.094c-1.611,7.07-3.531,14.656-5.762,22.295c-0.897,0.036-1.808,0.061-2.745,0.061 c-25.183-0.188-15.897-30.636-16.268-54.829C104.119,105.93,109.237,90.442,118.875,90.01z',
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
			bowPath: {
				name: 'bowPath',
				color: '#E56A19',
				path: 'M66.475,93.092c-2.99,0-5.504,1.656-6.471,3.978 c-3.567,1.286-7.841,3.193-12.256,5.569c-10.431,5.614-16.268,13.473-16.268,13.473s11.077-1.228,21.508-6.843 c3.408-1.833,6.47-3.718,9.011-5.48c1.205,0.897,2.764,1.432,4.476,1.432H69.7c1.774,0,3.396-0.581,4.616-1.538 c2.193,1.505,4.669,3.062,7.357,4.596c10.324,5.895,20.823,7.268,20.823,7.268s-6.226-8.198-16.55-14.092 c-3.58-2.043-7.037-3.752-10.079-5.056c-1.14-1.967-3.471-3.307-6.168-3.307H66.475z',
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
			facePath: {
				name: 'facePath',
				color: '#FDE5D6',
				path: 'M94.527,59.967 c0,18.855-17.554,31.634-27.849,31.376C56.819,91.097,38.83,78.823,38.83,59.967s12.468-34.141,27.849-34.141 C82.058,25.827,94.527,41.112,94.527,59.967z',
				make: function(dollpath) {
					dollpath.attr({
						'id': this.name,
						'connector-curvature': '0',
						'stroke-width': '0',
						'stroke-opacity': '1',
						'nodetypes': 'sssss'
					})
					.data('id', this.name);
				}
			},
			leftCheekPath: {
				name: 'leftCheekPath',
				color: '#FBCCAB',
				path: 'M57.205,67.063c0,3.944-3.294,7.142-7.357,7.142s-7.358-3.197-7.358-7.142c0-3.944,3.295-7.141,7.358-7.141 S57.205,63.119,57.205,67.063z',
				make: function(dollpath) {
					dollpath.attr({
						'id': this.name,
						'stroke-width': '0',
						'stroke-opacity': '1',
						'ry': '11.785714',
						'rx': '12.142858',
						'cy': '251.59448',
						'cx': '152.85715',
						'type': 'arc'
					})
					.data('id', this.name);
				}
			},
			rightCheekPath: {
				name: 'rightCheekPath',
				color: '#FBCCAB',
				path: 'M90.839,65.22c0,3.944-3.294,7.142-7.357,7.142c-4.064,0-7.358-3.197-7.358-7.142s3.294-7.142,7.358-7.142 C87.545,58.079,90.839,61.276,90.839,65.22z',
				make: function(dollpath) {
					dollpath.attr({
						'id': this.name,
						'stroke-width': '0',
						'stroke-opacity': '1',
						'ry': '11.785714',
						'rx': '12.142858',
						'cy': '251.59448',
						'cx': '152.85715',
						'type': 'arc'
					})
					.data('id', this.name);
				}
			},
			leftEyeBrowPath: {
				name: 'leftEyeBrowPath',
				color: '#502D17',
				path: 'M50.877,45.573 c4.929-2.828,9.708,2.018,8.239,1.48c-3.203-1.167-6.033-1.117-10.077,0.045C48.671,44.654,51.686,41.529,50.877,45.573z',
				make: function(dollpath) {
					dollpath.attr({
						'id': this.name,
						'connector-curvature': '0',
						'stroke-width': '0',
						'stroke-opacity': '1',
						'nodetypes': 'cccc'
					})
					.data('id', this.name);
				}
			},
			rightEyeBrowPath: {
				name: 'rightEyeBrowPath',
				color: '#502D17',
				path: 'M83.161,45.493 c0.805,0.208,0.644,1.4-0.131,1.071c-3.203-1.168-6.033-1.117-10.077,0.044C77.47,42.782,81.989,45.083,83.161,45.493z',
				make: function(dollpath) {
					dollpath.attr({
						'id': this.name,
						'connector-curvature': '0',
						'stroke-width': '0',
						'stroke-opacity': '1',
						'nodetypes': 'cccc'
					})
					.data('id', this.name);
				}
			},
			hairPath: {
				name: 'hairPath',
				color: '#C87137',
				path: 'M66.672,25.832c-14.162,0-25.841,12.96-27.604,29.732 c6.735-2.81,14.528-9.459,19.165-14.211c3.325-3.407,7.34-7.708,10.015-12.518c2.676,4.809,6.69,9.11,10.016,12.518 c3.882,3.979,9.976,9.286,15.81,12.558C91.739,37.949,80.364,25.832,66.672,25.832z',
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
			leftEyeLashPath: {
				name: 'leftEyeLashPath',
				color: '#29190F',
				path: 'M60.585,51.2529 c0.5469,0.2539,0.4941,1.3208-0.0742,1.0771c-3.417-0.8433-6.0547-0.6187-10.0605,0.5718 C51.6826,49.7563,60.0703,50.1655,60.585,51.2529z',
				make: function(dollpath) {
					dollpath.attr({
						'id': this.name,
						'connector-curvature': '0',
						'stroke-width': '0',
						'stroke-opacity': '1',
						'nodetypes': 'cccc'
					})
					.data('id', this.name);
				}
			},
			rightEyeLashPath: {
				name: 'rightEyeLashPath',
				color: '#29190F',
				path: 'M71.734,51.151 c5.195-2.301,9.723,0.678,9.865,2.108c-3.064-1.494-5.885-1.737-10.027-1.001C71.013,52.149,71.435,51.113,71.734,51.151 C72.033,51.188,71.734,51.151,71.734,51.151z',
				make: function(dollpath) {
					dollpath.attr({
						'id': this.name,
						'connector-curvature': '0',
						'stroke-width': '0',
						'stroke-opacity': '1',
						'nodetypes': 'cccsc'
					})
					.data('id', this.name);
				}
			},
			leftEyePath: {
				name: 'leftEyePath',
				color: '#29190F',
				path: 'M60.2319,53.585c0-1.1533-1.8389-2.085-4.1035-2.085 c-2.2656,0-4.1045,0.9316-4.1045,2.085c0,1.1523,1.8389,2.0952,4.1045,2.0952C58.3931,55.6802,60.2319,54.7373,60.2319,53.585z',
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
			rightEyePath: {
				name: 'rightEyePath',
				color: '#29190F',
				path: 'M80.232,53.585c0-1.153-1.839-2.085-4.104-2.085 c-2.266,0-4.104,0.932-4.104,2.085c0,1.152,1.839,2.095,4.104,2.095C78.393,55.68,80.232,54.737,80.232,53.585z',
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
			nosePath: {
				name: 'nosePath',
				color: '#D45714',
				path: 'M61.935,60.89c-0.015,0.126-0.021,0.253-0.021,0.383 c0,2.099,2.021,3.801,4.509,3.801s4.501-1.702,4.501-3.801c0-0.129-0.007-0.257-0.021-0.383c-0.23,1.917-2.146,3.414-4.479,3.414 S62.167,62.807,61.935,60.89L61.935,60.89z',
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
			lipsPath: {
				name: 'lipsPath',
				color: '#D45714',
				path: 'M52.327,66.719 c0.913,5.04,7.155,10.395,14.092,10.45c7.099-0.073,13.707-5.493,14.092-10.45c-0.812,3.323-8.88,1.224-13.828,2.801 C61.194,67.972,53.14,70.042,52.327,66.719z',
				make: function(dollpath) {
					dollpath.attr({
						'id': this.name,
						'connector-curvature': '0',
						'stroke-width': '0',
						'stroke-opacity': '1',
						'nodetypes': 'ccccc'
					})
					.data('id', this.name);
				}
			},
			branchPath: {
				name: 'branchPath',
				color: '#2C7B33',
				path: 'M67.2139,174.9185c5.8906,5.583,14.2441,6.6274,22.3613,2.9165c2.6445-1.209,5.2627-2.9209,7.7607-5.1445   c-8.6084-6.8081-15.8662-7.6851-21.4463-5.8936c5.4404-6.687,7.8896-16.4443,5.9863-26.9531   c-11.9717,7.0898-16.4639,15.5049-17.2441,22.8589c-2.8662-6.8179-9.5908-13.5835-23.0947-16.9263   c1.2891,11.3896,7.1309,20.5059,15.0898,25.0908c-2.4707-0.1016-5.0801,0.3174-7.7031,1.4976   c-4.0996,1.8423-8.2324,5.5405-11.9238,11.9956c7.3945,2.6582,14.3457,2.4521,19.7637-0.0742   c3.6133-1.6855,6.5479-4.4062,8.4766-7.999v0.001c-1.833,5.0352,8.2891,15.855,11.5068,14.3394   c0.043-0.0205,0.0879-0.0454,0.1289-0.0698c1.3408-0.8262,1.668-1.6006,1.3838-2.2275c-0.3652-0.8047-1.7461-1.3633-3.291-1.4683   C72.2227,186.6758,66.6934,178.4941,67.2139,174.9185L67.2139,174.9185z',
				make: function(dollpath) {
					dollpath.attr({
						'id': this.name,
						'stroke-width': '0',
						'stroke-opacity': '1'
					})
					.data('id', this.name);
				}
			},
			leftLeafPath: {
				name: 'leftLeafPath',
				color: '#ACD195',
				path: 'M39.4492,183.4419c7.9355,4.0498,20.1338,0.6592,24.8936-9.0312l-0.0029-0.002  c-5.8652,4.9844-11.6201,5.3315-14.291,3.6123c4.3994-0.5425,7.6162-1.207,12.0254-5.6279  c-3.916-1.7217-10.5352-1.5703-16.9248,3.8174C42.7949,178.1938,40.7734,180.6147,39.4492,183.4419z',
				make: function(dollpath) {
					dollpath.attr({
						'id': this.name,
						'stroke-width': '0',
						'stroke-opacity': '1'
					})
					.data('id', this.name);
				}
			},
			rightLeafPath: {
				name: 'rightLeafPath',
				color: '#ACD195',
				path: 'M68.3242,170.4785c5.2002,2.2402,10.6719,2.6597,14.5576,1.6367c-1.667,2.3457-6.6318,3.9907-13.251,1.769  l0.001,0.002c7.2725,6.5576,18.6836,5.3057,24.0029-0.7769c-3.4805-3.2568-8.2422-4.8809-12.7539-5.3291  C75.4385,167.2388,70.3555,168.4077,68.3242,170.4785z',
				make: function(dollpath) {
					dollpath.attr({
						'id': this.name,
						'stroke-width': '0',
						'stroke-opacity': '1'
					})
					.data('id', this.name);
				}
			},
			flowerPath1: {
				name: 'flowerPath1',
				color: '#E9AFAF',
				path: 'M46.668,176.8901c0.7734,0.7173,1.5117,1.2412,2.2109,1.6001c4.2402,2.1865,7.0039-1.6299,7.251-4.5117  c2.6465,0.7988,4.5576-0.2871,5.6396-1.9277c1.3555-2.0552,1.4062-4.9756-0.0312-6.1543c1.917-2.8652,1.3438-7.6812-1.7646-9.7363  c-1.9287-1.2754-4.8311-1.4878-8.7197,0.4863c-3.5645-1.751-6.6982-0.3442-8.3984,1.9067c-1.4219,1.8804-1.8447,4.3491-0.6865,6.062  c-3.5146,5.0195-2.5303,9.0439,0.1182,10.9971C43.4922,176.5,45.041,176.96,46.668,176.8901z',
				make: function(dollpath) {
					dollpath.attr({
						'id': this.name,
						'stroke-width': '0',
						'stroke-opacity': '1'
					})
					.data('id', this.name);
				}
			},
			flowerPath2: {
				name: 'flowerPath2',
				color: '#D45F5F',
				path: 'M46.4492,176.4219c0.7734,0.7178,1.5137,1.2397,2.2119,1.6006c4.2393,2.1846,7.0029-1.6318,7.25-4.5137  c2.6465,0.7998,4.5586-0.2871,5.6396-1.9277c1.3555-2.0542,1.4062-4.9751-0.0322-6.1548c1.918-2.8638,1.3447-7.6797-1.7637-9.7349  c-1.9268-1.2764-4.8301-1.4883-8.7197,0.4858c-3.5645-1.751-6.6982-0.3452-8.3984,1.9062c-1.4219,1.8804-1.8447,4.3501-0.6875,6.064  c-3.5127,5.0176-2.5293,9.041,0.1191,10.9961C43.2725,176.0303,44.8223,176.4897,46.4492,176.4219z M54.3281,160.1299  c0.3301,0.0581,0.8545,0.1401,1.2549,0.3457c0.0166,0.0107,0.0322,0.0088,0.0479,0.0195c2.2188,0.9697,2.8418,2.436,3.0596,3.6719  c2.0938-6.0093-6.3789-6.2139-6.3789-6.2139c0.71-2.5498,4.1924-2.2246,6.8457-0.0859c1.8828,1.521,2.8096,5.4482,0.0996,7.624  c1.8955,4.2139-2.5078,6.8008-4.4346,5.8594c3.3154-2.084,4.5898-5.4619-0.3643-9.7451l-0.0078-0.0059  c-3.7178-0.0669-6.9756,2.082-5.3828,5.4614c0.7832,1.6372,2.8906,2.5669,4.4512,1.3833c1.249-0.9551,1.3975-3.127-0.3047-3.7012  c0.585,1.1255-0.2793,2.501-1.5439,2.4678c-1.0537-0.0312-2.0703-1.2617-1.5273-2.3047c-0.0029-0.0146,0.0039-0.022,0.0098-0.0312  c0.0557-0.1333,0.1406-0.2715,0.2363-0.3896c2.041-2.9512,6.2246-0.1089,5.4092,2.9814c-0.8682,3.2539-5.001,3.7129-7.1279,1.4688  c-2.3086-2.4458-1.3809-6.2627,1.3203-7.9829C51.2666,160.1377,52.8359,159.8394,54.3281,160.1299z M44.1367,167.1338  c-1.7334-2.1533-3.0869-9.1387,5.4141-9.2104c-4.5605,3.3501-4.6719,7.3433-4.6377,9.0981  c0.6914,4.1719,4.3115,7.0771,7.9873,4.9004c-1.2871,4.0479-6.6367,3.624-7.5732,2.9688  C44.1201,174.0449,42.7129,170.7129,44.1367,167.1338z',
				make: function(dollpath) {
					dollpath.attr({
						'id': this.name,
						'stroke-width': '0',
						'stroke-opacity': '1'
					})
					.data('id', this.name);
				}
			},
			flowerPath3: {
				name: 'flowerPath3',
				color: '#D45F5F',
				path: 'M88.7725,138.4873c-0.624-2.0171-1.3799-3.6621-2.2305-4.9844c-5.1582-8.0249-13.7617-4.1777-17.0713,0.5664  c-3.7842-4.0303-8.1807-4.0605-11.6953-2.2998c-4.4004,2.2021-7.4141,7.21-6.1006,10.6904  c-6.1846,3.0454-10.0078,11.959-6.6807,18.6265c2.0645,4.1367,6.8799,7.4082,15.5898,7.8784  c4.4229,6.5967,11.2559,7.2939,16.4541,5.0962c4.3408-1.8354,7.543-5.6885,7.252-9.8149  c11.1035-5.1777,13.4248-13.1309,10.7891-19.1641C93.8809,142.3398,91.6582,139.9951,88.7725,138.4873z',
				make: function(dollpath) {
					dollpath.attr({
						'id': this.name,
						'stroke-width': '0',
						'stroke-opacity': '1'
					})
					.data('id', this.name);
				}
			},
			flowerPath4: {
				name: 'flowerPath4',
				color: '#FAD4D5',
				path: 'M57.9561,156.9507c-0.5127-0.4316-1.3398-1.0972-1.8262-1.8535c-0.0166-0.0371-0.0459-0.0469-0.0635-0.0845  c-2.873-3.8955-2.4844-7.0591-1.627-9.4155c-9.6357,8.314,4.8359,17.1401,4.8359,17.1401  c-3.7812,3.708-9.4883-0.3408-11.9424-6.6982c-1.7412-4.5156,0.5811-12.2441,7.4492-13.3037  c0.9297-9.1943,11.1436-9.2715,13.54-5.7148c-7.8262,0.2949-13.4102,4.873-9.1133,17.2441l0.0078,0.0186  c6.373,3.835,14.1631,3.3701,14.7842-4.0762c0.2812-3.6196-2.4385-7.3379-6.3252-6.8472c-3.1191,0.4043-5.5488,4.02-3.1738,6.7148  c0.1133-2.5356,2.9844-4.0542,5.1426-2.7329c1.792,1.1084,2.3232,4.2598,0.3389,5.5215c-0.0088,0.0264-0.0273,0.0352-0.0459,0.0439  c-0.2324,0.1748-0.5156,0.3301-0.7998,0.4395c-6.4873,3.0693-10.8896-6.0366-6.3867-10.5742  c4.7549-4.7666,12.3721-1.4307,13.8125,4.5845c1.5557,6.5435-3.8701,12.2271-10.2705,12.5063  C63.2686,159.9971,60.251,158.9453,57.9561,156.9507z M82.6152,155.0107c0.8477,5.4634-3.7939,18.9141-18.5908,10.5391  c11.251-1.2437,15.4365-8.0488,17.1348-11.1211c2.9717-7.917-0.3926-16.5693-8.9365-16.4756  c6.2773-5.7236,15.1201,0.3584,16.0869,2.4316C89.5566,143.0576,88.6582,150.2354,82.6152,155.0107z M87.8984,136.6113  c-0.625-2.0171-1.3828-3.6611-2.2314-4.9844c-5.1592-8.0234-13.7627-4.1777-17.0713,0.5659  c-3.7842-4.0298-8.1826-4.0591-11.6953-2.3003c-4.4004,2.2031-7.4141,7.2109-6.1016,10.6919  c-6.1836,3.0454-10.0059,11.9595-6.6787,18.627c2.0625,4.1372,6.8779,7.4087,15.5889,7.8774  c4.4238,6.5967,11.2559,7.2949,16.4551,5.0972c4.3398-1.8364,7.542-5.6895,7.252-9.8149  c11.1025-5.1777,13.4238-13.1309,10.7891-19.165C93.0059,140.4639,90.7842,138.1196,87.8984,136.6113z',
				make: function(dollpath) {
					dollpath.attr({
						'id': this.name,
						'stroke-width': '0',
						'stroke-opacity': '1'
					})
					.data('id', this.name);
				}
			}
		};
		this.pathOrder = [
			'basePath',
			'headPath',
			'bellyPath',
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
			'branchPath',
			'leftLeafPath',
			'rightLeafPath',
			'flowerPath1',
			'flowerPath2',
			'flowerPath3',
			'flowerPath4'
		];
	}
]);