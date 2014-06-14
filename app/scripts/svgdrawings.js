'use strict';

angular.module('personalApp.svgdrawings', [])

.directive('appdirBckgdAttractor', [
	function() {
		return {
			restrict: 'A',
			link: function(scope, iElement, iAttr) {
				console.log(scope, iElement, iAttr);
				var w = 600, h = 400;
				var paper = new Raphael(iElement[0]);
				
				// http://www.downloadclipart.net/browse/13031/russian-dolls-clipart
				
				var basePath1 = paper.path('M74.776,10.916c-33.021,0.439-39.297,27.441-39.297,54.789 c0.192,22.428-20.81,34.057-20.81,55.662c0,0-2.566,23.821,0,35.086c5.212,22.879,13.528,51.22,25.876,68.961 c-7.27,3.925-11.574,8.787-11.574,13.361c0,9.898,20.111,17.256,46.923,17.256s46.922-7.357,46.922-17.256 c0-4.822-4.775-9.975-12.776-14c12.822-17.626,22.274-45.285,26.994-68.322c2.331-11.375-2.152-35.086-2.152-35.086 c-1.689-27.477-20.878-35.626-20.809-55.662C114.073,38.357,107.791,10.477,74.776,10.916L74.776,10.916z')
				.attr({id: 'basePath1','connector-curvature': '0',fill: '#ECC117','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'basePath1');
				
				var headPath1 = paper.path('M75.104,10.662c-33.021,0.44-39.297,27.44-39.297,54.788 c0.078,9.069-3.309,16.371-7.372,23.282c12.113,9.522,28.931,13.284,47.516,13.284c18.444,0,35.136-3.699,47.228-13.062 c-4.629-7.359-8.81-14.139-8.777-23.504C114.4,38.102,108.118,10.222,75.104,10.662L75.104,10.662z')
				.attr({id: 'headPath1','connector-curvature': '0',fill: '#E56A19','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'headPath1');
				
				var bellyPath1 = paper.path('M14.774,158.078 c5.23,22.609,13.438,50.107,25.521,67.467c-3.32,1.793-6.01,3.779-7.965,5.846c9.311,7.344,22.699,11.591,41.924,11.591 c20.361,0,34.166-4.708,43.516-12.759c-2.074-1.891-4.764-3.703-7.98-5.322c12.545-17.246,21.854-44.074,26.671-66.803 C131.627,180.879,20.843,180.274,14.774,158.078L14.774,158.078z')
				.attr({id: 'bellyPath1','connector-curvature': '0',nodetypes: 'cccsccccc',fill: '#E56A19','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'bellyPath1');
				
				var leftHandPath1 = paper.path('M26.469,172.567c-2.8,0-5.396,0.705-7.592,1.896 c2.053,7.375,4.424,14.861,7.101,22.052c0.165,0.005,0.325,0.021,0.491,0.021c7.809,0,10.27-9.51,10.27-16.127 C36.738,173.793,34.277,172.567,26.469,172.567z')
				.attr({id: 'leftHandPath1','connector-curvature': '0',fill: '#FDE5D6','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'leftHandPath1');
				
				var leftArmPath1 = paper.path('M23.198,97.11c-4.66,7.574-8.913,15.274-8.913,24.996 c0,0-2.566,23.828,0,35.094c1.61,7.07,3.531,14.656,5.762,22.295c0.897,0.036,1.808,0.061,2.745,0.061 c25.183-0.188,15.898-30.636,16.268-54.829C39.06,113.147,32.836,97.542,23.198,97.11z')
				.attr({id: 'leftArmPath1','connector-curvature': '0',fill: '#FAF3EE','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'leftArmPath1');
				
				var rightHandPath1 = paper.path('M124.717,173.567c2.8,0,5.396,0.705,7.592,1.896 c-2.053,7.375-4.423,14.861-7.101,22.052c-0.165,0.005-0.325,0.021-0.491,0.021c-7.808,0-10.27-9.51-10.27-16.127 C114.447,174.793,116.909,173.567,124.717,173.567z')
				.attr({id: 'rightHandPath1','connector-curvature': '0',fill: '#FDE5D6','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'rightHandPath1');
				
				var rightArmPath1 = paper.path('M127.969,98.016c4.66,7.574,8.913,15.274,8.913,24.996 c0,0,2.566,23.828,0,35.094c-1.61,7.07-3.53,14.656-5.762,22.295c-0.897,0.036-1.808,0.061-2.745,0.061 c-25.183-0.188-15.897-30.636-16.268-54.829C112.107,114.053,118.331,98.448,127.969,98.016z')
				.attr({id: 'rightArmPath1','connector-curvature': '0',fill: '#FAF3EE','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'rightArmPath1');
				
				var bowPath1 = paper.path('M75.482,99.309c-2.99,0-5.504,1.656-6.471,3.978 c-3.567,1.286-7.841,3.193-12.256,5.569c-10.431,5.614-16.268,13.473-16.268,13.473s11.077-1.228,21.508-6.843 c3.408-1.833,6.47-3.718,9.011-5.48c1.205,0.897,2.764,1.432,4.476,1.432h3.225c1.774,0,3.396-0.581,4.616-1.538 c2.193,1.505,4.669,3.062,7.357,4.596c10.324,5.895,20.823,7.268,20.823,7.268s-6.226-8.198-16.55-14.092 c-3.58-2.043-7.037-3.752-10.079-5.056c-1.14-1.967-3.471-3.307-6.168-3.307H75.482z')
				.attr({id: 'bowPath1','connector-curvature': '0',fill: '#E56A19','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'bowPath1');
				
				var facePath1 = paper.path('M103.845,65.729 c0,18.855-17.554,31.634-27.849,31.376c-9.859-0.247-27.849-12.521-27.849-31.376s12.468-34.141,27.849-34.141 C91.376,31.589,103.845,46.874,103.845,65.729z')
				.attr({id: 'facePath1','connector-curvature': '0',nodetypes: 'sssss',fill: '#FDE5D6','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'facePath1');
				
				
				var leftCheekPath1 = paper.path('M66.212,71.28c0,3.944-3.294,7.142-7.357,7.142s-7.358-3.197-7.358-7.142c0-3.944,3.295-7.141,7.358-7.141 S66.212,67.336,66.212,71.28z')
				.attr({id: 'leftCheekPath1',ry: '11.785714',rx: '12.142858',cy: '251.59448',cx: '152.85715',type: 'arc',fill: '#FBCCAB','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'leftCheekPath1');
				
				var rightCheekPath1 = paper.path('M101.489,71.491c0,3.944-3.294,7.142-7.357,7.142c-4.064,0-7.358-3.197-7.358-7.142s3.294-7.142,7.358-7.142 C98.195,64.349,101.489,67.546,101.489,71.491z')
				.attr({id: 'rightCheekPath1',ry: '11.785714',rx: '12.142858',cy: '251.59448',cx: '152.85715',type: 'arc',fill: '#FBCCAB','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'rightCheekPath1');
				
				var leftEyeBrowPath1_1 = paper.path('M59.885,50.79 c4.929-2.828,9.708,2.018,8.239,1.48c-3.203-1.167-6.033-1.117-10.077,0.045C57.679,49.872,60.693,46.746,59.885,50.79z')
				.attr({id: 'leftEyeBrowPath1_1','connector-curvature': '0',nodetypes: 'cccc',fill: '#502D17','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'leftEyeBrowPath1_1');
				
				var rightEyeBrowPath1_1 = paper.path('M93.168,50.71 c0.805,0.208,0.644,1.4-0.131,1.071c-3.203-1.168-6.033-1.117-10.077,0.044C87.478,47.999,91.996,50.3,93.168,50.71z')
				.attr({id: 'rightEyeBrowPath1_1','connector-curvature': '0',nodetypes: 'cccc',fill: '#502D17','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'rightEyeBrowPath1_1');
				
				var hairPath1 = paper.path('M75.68,30.049c-14.162,0-25.841,12.96-27.604,29.732 c6.735-2.81,14.528-9.459,19.165-14.211c3.325-3.407,7.34-7.708,10.015-12.518c2.676,4.809,6.69,9.11,10.016,12.518 c3.882,3.979,9.976,9.286,15.81,12.558C100.746,42.167,89.371,30.049,75.68,30.049z')
				.attr({id: 'hairPath1','connector-curvature': '0',fill: '#C77137','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'hairPath1');
				
				var leftEyePath1_1 = paper.path('M61.946,58.802c0-1.153,1.838-2.085,4.104-2.085 s4.104,0.932,4.104,2.085c0,1.152-1.838,2.095-4.104,2.095S61.946,59.955,61.946,58.802z')
				.attr({id: 'leftEyePath1_1','connector-curvature': '0',fill: '#29190F','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'leftEyePath1_1');
				
				var rightEyePath1_1 = paper.path('M90.239,58.802c0-1.153-1.839-2.085-4.104-2.085 c-2.266,0-4.104,0.932-4.104,2.085c0,1.152,1.839,2.095,4.104,2.095C88.4,60.897,90.239,59.955,90.239,58.802z')
				.attr({id: 'rightEyePath1_1','connector-curvature': '0',fill: '#29190F','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'rightEyePath1_1');
				
				var leftEyeLashPath1_1 = paper.path('M70.444,56.369 c-5.195-2.301-9.724,0.678-9.866,2.108c3.065-1.494,5.886-1.737,10.027-1.001C71.165,57.367,70.629,56.343,70.444,56.369 C70.26,56.393,70.444,56.369,70.444,56.369z')
				.attr({id: 'leftEyeLashPath1_1','connector-curvature': '0',nodetypes: 'ccczc',fill: '#29190F','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'leftEyeLashPath1_1');
				
				var rightEyeLashPath1_1 = paper.path('M81.741,56.369 c5.195-2.301,9.723,0.678,9.865,2.108c-3.064-1.494-5.885-1.737-10.027-1.001C81.021,57.367,81.442,56.331,81.741,56.369 C82.04,56.406,81.741,56.369,81.741,56.369z')
				.attr({id: 'rightEyeLashPath1_1','connector-curvature': '0',nodetypes: 'cccsc',fill: '#29190F','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'rightEyeLashPath1_1');
				
				var nosePath1_1 = paper.path('M71.942,66.107c-0.015,0.126-0.021,0.253-0.021,0.383 c0,2.099,2.021,3.801,4.509,3.801s4.501-1.702,4.501-3.801c0-0.129-0.007-0.257-0.021-0.383c-0.23,1.917-2.146,3.414-4.479,3.414 S72.174,68.024,71.942,66.107L71.942,66.107z')
				.attr({id: 'nosePath1_1','connector-curvature': '0',fill: '#D45714','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'nosePath1_1');
				
				var lipsPath1 = paper.path('M62.334,72.281 c0.913,5.04,7.155,10.395,14.092,10.45c7.099-0.073,13.707-5.493,14.092-10.45c-0.812,3.323-8.88,1.224-13.828,2.801 C71.201,73.534,63.147,75.604,62.334,72.281z')
				.attr({id: 'lipsPath1','connector-curvature': '0',nodetypes: 'ccccc',fill: '#D45714','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'lipsPath1');
				
				paper.setViewBox(0, 0, w, h, true);
				paper.setSize('100%', '100%');
				//paper.canvas.setAttribute('preserveAspectRatio', 'xMidYMid');
				//paper.canvas.setAttribute('meetOrSlice', 'meet');
				
			}
		};
	}
]);