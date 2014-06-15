'use strict';

angular.module('personalApp.svgdrawings', [])

.directive('appdirBckgdAttractor', [
	function() {
		return {
			restrict: 'A',
			link: function(scope, iElement, iAttr) {
				console.log(scope, iElement, iAttr);
				var w = 134, h = 254;
				var doll = new Raphael(iElement[0]);
				
				// http://www.downloadclipart.net/browse/13031/russian-dolls-clipart
				var basePath = doll.path('M66.384,4.445c-33.021,0.44-39.297,27.441-39.297,54.79 c0.192,22.427-20.81,34.056-20.81,55.662c0,0-2.566,23.821,0,35.086c5.212,22.879,13.528,51.22,25.876,68.961 c-7.27,3.925-11.574,8.787-11.574,13.361c0,9.898,20.111,17.256,46.923,17.256s46.922-7.357,46.922-17.256 c0-4.822-4.775-9.975-12.776-14c12.822-17.626,22.274-45.285,26.994-68.322c2.332-11.375-2.152-35.086-2.152-35.086 c-1.693-27.546-20.877-35.705-20.808-55.662C105.681,31.886,99.399,4.005,66.384,4.445L66.384,4.445z')
				.attr({id: 'basePath','connector-curvature': '0',fill: '#ECC117','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'basePath');
				
				var headPath = doll.path('M66.365,4.354c-33.021,0.44-39.297,27.44-39.297,54.788 c0.078,9.069-3.309,16.371-7.372,23.282c12.113,9.522,28.931,13.284,47.516,13.284c20.003,0,34.019-2.804,47.369-13.141 c-4.327-6.878-8.952-13.566-8.918-23.425C105.662,31.794,99.38,3.915,66.365,4.354L66.365,4.354z')
				.attr({id: 'headPath','connector-curvature': '0',fill: '#E56A19','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'headPath');
				
				var bellyPath = doll.path('M6.633,151.474 c5.23,22.609,13.438,50.107,25.521,67.467c-3.319,1.793-6.009,3.779-7.965,5.846c9.312,7.344,22.699,11.591,41.924,11.591 c20.361,0,34.166-4.708,43.517-12.759c-2.074-1.891-4.764-3.703-7.981-5.322c12.545-17.246,21.854-44.074,26.671-66.803 C123.485,174.275,12.702,173.67,6.633,151.474L6.633,151.474z')
				.attr({id: 'bellyPath','connector-curvature': '0',nodetypes: 'cccsccccc',fill: '#E56A19','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'bellyPath');
				
				var leftHandPath = doll.path('M18.461,166.35c-2.8,0-5.396,0.705-7.592,1.896 c2.053,7.375,4.394,14.861,7.071,22.052c0.165,0.005,0.355,0.021,0.521,0.021c7.809,0,10.27-9.51,10.27-16.127 C28.731,167.576,26.27,166.35,18.461,166.35z')
				.attr({id: 'leftHandPath','connector-curvature': '0',fill: '#FDE5D6','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'leftHandPath');
				
				var rightHandPath = doll.path('M116.709,166.35c2.8,0,5.396,0.705,7.592,1.896 c-2.053,7.375-4.423,14.861-7.101,22.052c-0.165,0.005-0.325,0.021-0.491,0.021c-7.808,0-10.27-9.51-10.27-16.127 C106.44,167.576,108.902,166.35,116.709,166.35z')
				.attr({id: 'rightHandPath','connector-curvature': '0',fill: '#FDE5D6','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'rightHandPath');
				
				var leftArmPath = doll.path('M15.181,89.893c-4.66,7.574-8.943,15.274-8.943,24.996 c0,0-2.566,23.828,0,35.094c1.61,7.07,3.531,14.656,5.762,22.295c0.897,0.036,1.808,0.061,2.745,0.061 c25.183-0.188,15.898-30.636,16.268-54.829C31.012,105.93,24.818,90.324,15.181,89.893z')
				.attr({id: 'leftArmPath','connector-curvature': '0',fill: '#FAF3EE','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'leftArmPath');
				
				var rightArmPath = doll.path('M118.875,90.01c4.66,7.574,10.019,15.156,10.019,24.878 c0,0,2.566,23.828,0,35.094c-1.611,7.07-3.531,14.656-5.762,22.295c-0.897,0.036-1.808,0.061-2.745,0.061 c-25.183-0.188-15.897-30.636-16.268-54.829C104.119,105.93,109.237,90.442,118.875,90.01z')
				.attr({id: 'rightArmPath','connector-curvature': '0',fill: '#FAF3EE','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'rightArmPath');
				
				var bowPath = doll.path('M66.475,93.092c-2.99,0-5.504,1.656-6.471,3.978 c-3.567,1.286-7.841,3.193-12.256,5.569c-10.431,5.614-16.268,13.473-16.268,13.473s11.077-1.228,21.508-6.843 c3.408-1.833,6.47-3.718,9.011-5.48c1.205,0.897,2.764,1.432,4.476,1.432H69.7c1.774,0,3.396-0.581,4.616-1.538 c2.193,1.505,4.669,3.062,7.357,4.596c10.324,5.895,20.823,7.268,20.823,7.268s-6.226-8.198-16.55-14.092 c-3.58-2.043-7.037-3.752-10.079-5.056c-1.14-1.967-3.471-3.307-6.168-3.307H66.475z')
				.attr({id: 'bowPath','connector-curvature': '0',fill: '#E56A19','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'bowPath');
				
				var facePath = doll.path('M94.527,59.967 c0,18.855-17.554,31.634-27.849,31.376C56.819,91.097,38.83,78.823,38.83,59.967s12.468-34.141,27.849-34.141 C82.058,25.827,94.527,41.112,94.527,59.967z')
				.attr({id: 'facePath','connector-curvature': '0',nodetypes: 'sssss',fill: '#FDE5D6','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'facePath');
				
				var leftCheekPath = doll.path('M57.205,67.063c0,3.944-3.294,7.142-7.357,7.142s-7.358-3.197-7.358-7.142c0-3.944,3.295-7.141,7.358-7.141 S57.205,63.119,57.205,67.063z')
				.attr({id: 'leftCheekPath',ry: '11.785714',rx: '12.142858',cy: '251.59448',type: 'arc',cx: '152.85715',fill: '#FBCCAB','stroke-width': '0','stroke-opacity': '1'}).data('id', 'leftCheekPath');
				
				var rightCheekPath = doll.path('M90.839,65.22c0,3.944-3.294,7.142-7.357,7.142c-4.064,0-7.358-3.197-7.358-7.142s3.294-7.142,7.358-7.142 C87.545,58.079,90.839,61.276,90.839,65.22z')
				.attr({id: 'rightCheekPath',ry: '11.785714',rx: '12.142858',cy: '251.59448',type: 'arc',cx: '152.85715',fill: '#FBCCAB','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'rightCheekPath');
				
				var leftEyeBrowPath = doll.path('M50.877,45.573 c4.929-2.828,9.708,2.018,8.239,1.48c-3.203-1.167-6.033-1.117-10.077,0.045C48.671,44.654,51.686,41.529,50.877,45.573z')
				.attr({id: 'leftEyeBrowPath','connector-curvature': '0',nodetypes: 'cccc',fill: '#502D17','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'leftEyeBrowPath');
				
				var rightEyeBrowPath = doll.path('M83.161,45.493 c0.805,0.208,0.644,1.4-0.131,1.071c-3.203-1.168-6.033-1.117-10.077,0.044C77.47,42.782,81.989,45.083,83.161,45.493z')
				.attr({id: 'rightEyeBrowPath','connector-curvature': '0',nodetypes: 'cccc',fill: '#502D17','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'rightEyeBrowPath');
				
				var hairPath = doll.path('M66.672,25.832c-14.162,0-25.841,12.96-27.604,29.732 c6.735-2.81,14.528-9.459,19.165-14.211c3.325-3.407,7.34-7.708,10.015-12.518c2.676,4.809,6.69,9.11,10.016,12.518 c3.882,3.979,9.976,9.286,15.81,12.558C91.739,37.949,80.364,25.832,66.672,25.832z')
				.attr({id: 'hairPath','connector-curvature': '0',fill: '#C87137','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'hairPath');
				
				var leftEyeLashPath = doll.path('M312.811,51.151 c5.195-2.301,9.724,0.678,9.866,2.108c-3.065-1.494-5.886-1.737-10.027-1.001C312.09,52.149,312.626,51.126,312.811,51.151 C312.996,51.176,312.811,51.151,312.811,51.151z')
				.attr({id: 'leftEyeLashPath','connector-curvature': '0',nodetypes: 'ccczc',fill: '#29190F','stroke-width': '0','stroke-opacity': '1'})
				.transform('m-1,0,0,1,373.24807,0')
				.data('id', 'leftEyeLashPath');
				
				var rightEyeLashPath = doll.path('M71.734,51.151 c5.195-2.301,9.723,0.678,9.865,2.108c-3.064-1.494-5.885-1.737-10.027-1.001C71.013,52.149,71.435,51.113,71.734,51.151 C72.033,51.188,71.734,51.151,71.734,51.151z')
				.attr({id: 'rightEyeLashPath','connector-curvature': '0',nodetypes: 'cccsc',fill: '#29190F','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'rightEyeLashPath');
				
				var leftEyePath = doll.path('M321.309,53.585c0-1.153-1.838-2.085-4.104-2.085 s-4.104,0.932-4.104,2.085c0,1.152,1.838,2.095,4.104,2.095S321.309,54.737,321.309,53.585z')
				.attr({id: 'leftEyePath','connector-curvature': '0',fill: '#29190F','stroke-width': '0','stroke-opacity': '1'})
				.transform('m-1,0,0,1,373.24807,0')
				.data('id', 'leftEyePath');
				
				var rightEyePath = doll.path('M80.232,53.585c0-1.153-1.839-2.085-4.104-2.085 c-2.266,0-4.104,0.932-4.104,2.085c0,1.152,1.839,2.095,4.104,2.095C78.393,55.68,80.232,54.737,80.232,53.585z')
				.attr({id: 'rightEyePath','connector-curvature': '0',fill: '#29190F','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'rightEyePath');
				
				var nosePath = doll.path('M61.935,60.89c-0.015,0.126-0.021,0.253-0.021,0.383 c0,2.099,2.021,3.801,4.509,3.801s4.501-1.702,4.501-3.801c0-0.129-0.007-0.257-0.021-0.383c-0.23,1.917-2.146,3.414-4.479,3.414 S62.167,62.807,61.935,60.89L61.935,60.89z')
				.attr({id: 'nosePath','connector-curvature': '0',fill: '#D45714','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'nosePath');
				
				var lipsPath = doll.path('M52.327,66.719 c0.913,5.04,7.155,10.395,14.092,10.45c7.099-0.073,13.707-5.493,14.092-10.45c-0.812,3.323-8.88,1.224-13.828,2.801 C61.194,67.972,53.14,70.042,52.327,66.719z')
				.attr({id: 'lipsPath','connector-curvature': '0',nodetypes: 'ccccc',fill: '#D45714','stroke-width': '0','stroke-opacity': '1'})
				.data('id', 'lipsPath');
				
				// FLOWERS
				
				var leafSouthPath1 = doll.path('M-230.247,350.081 c-3.761-7.14-5.316-13.713-3.473-14.683c1.843-0.971,8.839-4.455,12.6,2.683c3.761,7.139,9.278,11.625,1.018,23.168 C-222.343,353.373-226.486,357.219-230.247,350.081L-230.247,350.081z')
				.attr({id: 'leafSouthPath1','connector-curvature': '0',nodetypes: 'scscs',fill: '#2D7B33','stroke-width': '0','stroke-opacity': '1'})
				.transform('m1.0520806,0,0,1.1281453,312.67215,-206.49091')
				.data('id', 'leafSouthPath1');
				
				var leafSouthPath2 = doll.path('M-227.063,348.233 c-2.852-5.415-4.032-10.401-2.635-11.137c1.398-0.736,6.705-3.379,9.558,2.036c2.852,5.415,7.037,8.819,0.772,17.574 C-221.067,350.731-224.21,353.649-227.063,348.233z')
				.attr({id: 'leafSouthPath2','connector-curvature': '0',nodetypes: 'scscs',fill: '#8AC268','stroke-width': '0','stroke-opacity': '1'})
				.transform('m1.0520806,0,0,1.1281453,312.67215,-206.49091')
				.data('id', 'leafSouthPath2');
				
				var leafSouthPath3 = doll.path('M-224.118,345.867 c-2.145-4.07-3.032-7.82-1.982-8.373c1.051-0.553,5.041-2.541,7.186,1.531c2.144,4.07,5.291,6.629,0.581,13.211 C-219.611,347.745-221.974,349.939-224.118,345.867L-224.118,345.867z')
				.attr({id: 'leafSouthPath3','connector-curvature': '0',nodetypes: 'scscs',fill: '#ACD295','stroke-width': '0','stroke-opacity': '1'})
				.transform('m1.0520806,0,0,1.1281453,312.67215,-206.49091')
				.data('id', 'leafSouthPath3');
				
				var leafEastPath1 = doll.path('M-229.931,315.55 c-11.155,0-20.199,2.334-20.199,5.213c0,2.878,0.247,13.682,11.402,13.682c11.156,0,20.2,3.857,28.996-13.682 C-220.808,323.097-218.775,315.55-229.931,315.55z')
				.attr({id: 'leafEastPath1','connector-curvature': '0',nodetypes: 'scscs',fill: '#2D7B33','stroke-width': '0','stroke-opacity': '1'})
				.transform('m1.0520806,0,0,1.1281453,312.67215,-206.49091')
				.data('id', 'leafEastPath1');
				
				var leafEastPath2 = doll.path('M-230.138,320.634 c-8.462,0-15.322,1.77-15.322,3.954c0,2.184,0.188,10.38,8.65,10.38c8.462,0,15.321,2.924,21.994-10.38 C-223.218,326.359-221.675,320.634-230.138,320.634L-230.138,320.634z')
				.attr({id: 'leafEastPath2','connector-curvature': '0',nodetypes: 'scscs',fill: '#8AC268','stroke-width': '0','stroke-opacity': '1'})
				.transform('m1.0520806,0,0,1.1281453,312.67215,-206.49091')
				.data('id', 'leafEastPath2');
				
				var leafEastPath3 = doll.path('M-231.136,325.76 c-6.362,0-11.519,1.33-11.519,2.973c0,1.641,0.14,7.803,6.502,7.803c6.362,0,11.52,2.199,16.536-7.803 C-225.933,330.064-224.774,325.76-231.136,325.76z')
				.attr({id: 'leafEastPath3','connector-curvature': '0',nodetypes: 'scscs',fill: '#ACD295','stroke-width': '0','stroke-opacity': '1'})
				.transform('m1.0520806,0,0,1.1281453,312.67215,-206.49091')
				.data('id', 'leafEastPath3');
				
				var leafNorthPath1 = doll.path('M-240.503,300.092 c0,11.155-2.334,20.199-5.213,20.199c-2.878,0-13.683-0.247-13.683-11.402c0-11.156-3.857-20.2,13.683-28.996 C-248.049,290.97-240.503,288.935-240.503,300.092L-240.503,300.092z')
				.attr({id: 'leafNorthPath1','connector-curvature': '0',nodetypes: 'scscs',fill: '#2D7B33','stroke-width': '0','stroke-opacity': '1'})
				.transform('m1.0520806,0,0,1.1281453,312.67215,-206.49091')
				.data('id', 'leafNorthPath1');
				
				var leafNorthPath2 = doll.path('M-242.62,302.851 c0,8.462-1.77,15.322-3.954,15.322s-10.379-0.187-10.379-8.649c0-8.462-2.925-15.322,10.379-21.994 C-248.344,295.932-242.62,294.389-242.62,302.851L-242.62,302.851z')
				.attr({id: 'leafNorthPath2','connector-curvature': '0',nodetypes: 'scscs',fill: '#8AC268','stroke-width': '0','stroke-opacity': '1'})
				.transform('m1.0520806,0,0,1.1281453,312.67215,-206.49091')
				.data('id', 'leafNorthPath2');
				
				var leafNorthPath3 = doll.path('M-243.435,306.165 c0,6.362-1.331,11.52-2.972,11.52c-1.642,0-7.804-0.142-7.804-6.504s-2.2-11.519,7.804-16.536 C-247.738,300.963-243.435,299.803-243.435,306.165z')
				.attr({id: 'leafNorthPath3','connector-curvature': '0',nodetypes: 'scscs',fill: '#ACD295','stroke-width': '0','stroke-opacity': '1'})
				.transform('m1.0520806,0,0,1.1281453,312.67215,-206.49091')
				.data('id', 'leafNorthPath3');
				
				var leafWestPath1 = doll.path('M-246.423,340.478 c8.056-0.458,14.49-2.513,14.373-4.592c-0.118-2.079-0.74-9.872-8.795-9.414c-8.056,0.458-14.745-1.956-20.377,11.071 C-253.319,335.403-254.479,340.936-246.423,340.478z')
				.attr({id: 'leafWestPath1','connector-curvature': '0',nodetypes: 'scscs',fill: '#2D7B33','stroke-width': '0','stroke-opacity': '1'})
				.transform('m1.0520806,0,0,1.1281453,312.67215,-206.49091')
				.data('id', 'leafWestPath1');
				
				var leafWestPath2 = doll.path('M-248.818,339.063 c6.11-0.347,10.992-1.906,10.902-3.483c-0.089-1.577-0.561-7.488-6.671-7.141c-6.11,0.347-11.184-1.485-15.457,8.397 C-254.049,335.212-254.928,339.41-248.818,339.063L-248.818,339.063z')
				.attr({id: 'leafWestPath2','connector-curvature': '0',nodetypes: 'scscs',fill: '#8AC268','stroke-width': '0','stroke-opacity': '1'})
				.transform('m1.0520806,0,0,1.1281453,312.67215,-206.49091')
				.data('id', 'leafWestPath2');
				
				var leafWestPath3 = doll.path('M-251.558,337.402 c4.594-0.261,8.263-1.433,8.196-2.619c-0.068-1.185-0.421-5.629-5.016-5.368c-4.594,0.26-8.409-1.117-11.62,6.312 C-255.491,334.508-256.152,337.664-251.558,337.402z')
				.attr({id: 'leafWestPath3','connector-curvature': '0',nodetypes: 'scscs',fill: '#ACD295','stroke-width': '0','stroke-opacity': '1'})
				.transform('m1.0520806,0,0,1.1281453,312.67215,-206.49091')
				.data('id', 'leafWestPath3');
				
				var flowerNorthPath1 = doll.path('M-239.664,305.956 c-17.414-9.664,17.459-36.392,10.716-5.713c7.855-12.124,28.272-12.844,11.171,4.214c11.221,2.721,26.737,8.393,7.193,13.319 c20.096,13.222-4.554,21.504-16.967,10.265C-239.822,328.665-255.175,320.677-239.664,305.956z')
				.attr({id: 'flowerNorthPath1','connector-curvature': '0',nodetypes: 'cccccc',fill: '#E8AFAF','stroke-width': '0','stroke-opacity': '1'})
				.transform('m1.0520806,0,0,1.1281453,312.67215,-206.49091')
				.data('id', 'flowerNorthPath1');
				
				
				var flowerNorthPath2 = doll.path('M-235.941,305.956 c-15.184-9.664,15.224-36.392,9.344-5.713c6.848-12.124,24.653-12.844,9.741,4.214c9.784,2.721,23.314,8.393,6.272,13.319 c17.523,13.222-3.971,21.504-14.795,10.265C-236.079,328.665-249.465,320.677-235.941,305.956z')
				.attr({id: 'flowerNorthPath2','connector-curvature': '0',nodetypes: 'cccccc',fill: '#E8AFAF','stroke-width': '0','stroke-opacity': '1'})
				.transform('m1.0520806,0,0,1.1281453,312.67215,-206.49091')
				.data('id', 'flowerNorthPath2');
				
				
				var flowerNorthPath3 = doll.path('M-234.438,308.717 c-11.843-7.538,11.875-28.384,7.289-4.456c5.341-9.456,19.227-10.019,7.597,3.287c7.632,2.122,18.185,6.547,4.892,10.388 c13.668,10.313-3.097,16.773-11.539,8.005C-234.544,326.43-244.986,320.199-234.438,308.717L-234.438,308.717z')
				.attr({id: 'flowerNorthPath3','connector-curvature': '0',nodetypes: 'cccccc',fill: '#FAD4D5','stroke-width': '0','stroke-opacity': '1'})
				.transform('m1.0520806,0,0,1.1281453,312.67215,-206.49091')
				.data('id', 'flowerNorthPath3');
				
				var flowerNorthPath4 = doll.path('M-237.015,311.626 c-10.591-6.74,10.618-25.382,6.517-3.985c4.777-8.456,17.194-8.958,6.794,2.939c6.824,1.897,16.261,5.854,4.375,9.29 c12.222,9.222-2.77,14.998-10.319,7.159C-237.112,327.465-246.448,321.894-237.015,311.626z')
				.attr({id: 'flowerNorthPath4','connector-curvature': '0',nodetypes: 'cccccc',fill: '#D45F60','stroke-width': '0','stroke-opacity': '1'})
				.transform('m1.0520806,0,0,1.1281453,312.67215,-206.49091')
				.data('id', 'flowerNorthPath4');
				
				var flowerNorthPath5 = doll.path('M-238.093,313.398 c-6.353-4.043,6.369-15.225,3.909-2.391c2.865-5.071,10.313-5.373,4.075,1.763c4.093,1.138,9.753,3.511,2.623,5.572 c7.331,5.531-1.661,8.996-6.188,4.294C-238.15,322.898-243.75,319.556-238.093,313.398z')
				.attr({id: 'flowerNorthPath5','connector-curvature': '0',nodetypes: 'cccccc',fill: '#FCE6E7','stroke-width': '0','stroke-opacity': '1'})
				.transform('m1.0520806,0,0,1.1281453,312.67215,-206.49091')
				.data('id', 'flowerNorthPath5');
				
				var flowerSouthPath1 = doll.path('M-807.515,296.971 c-17.413-9.664,17.459-36.392,10.717-5.712c7.854-12.124,28.272-12.845,11.17,4.213c11.221,2.721,26.739,8.395,7.193,13.318 c20.097,13.223-4.553,21.506-16.967,10.266C-807.672,319.681-823.025,311.692-807.515,296.971z')
				.attr({id: 'flowerSouthPath1','connector-curvature': '0',nodetypes: 'cccccc',fill: '#E8AFAF','transform-center-x': '7.4100395','transform-center-y': '19.192898','stroke-width': '0','stroke-opacity': '1'})
				.transform('m-0.29204511,0.84184917,0.64636533,-0.02478471,-368.52113,861.9997')
				.data('id', 'flowerSouthPath1');
				
				var flowerSouthPath2 = doll.path('M-803.791,296.972 c-15.184-9.665,15.225-36.392,9.344-5.714c6.849-12.124,24.653-12.845,9.741,4.214c9.785,2.721,23.315,8.394,6.272,13.318 c17.524,13.224-3.971,21.505-14.795,10.265C-803.929,319.68-817.315,311.693-803.791,296.972z')
				.attr({id: 'flowerSouthPath2','connector-curvature': '0',nodetypes: 'cccccc',fill: '#E8AFAF','transform-center-x': '7.4100395','transform-center-y': '19.192898','stroke-width': '0','stroke-opacity': '1'})
				.transform('m-0.29204511,0.84184917,0.64636533,-0.02478471,-368.52113,861.9997')
				.data('id', 'flowerSouthPath2');
				
				var flowerSouthPath3 = doll.path('M-802.288,299.733 c-11.843-7.539,11.875-28.386,7.288-4.456c5.343-9.457,19.228-10.02,7.597,3.286c7.633,2.122,18.185,6.547,4.893,10.389 c13.667,10.312-3.098,16.773-11.54,8.006C-802.395,317.445-812.836,311.215-802.288,299.733L-802.288,299.733z')
				.attr({id: 'flowerSouthPath3','connector-curvature': '0',nodetypes: 'cccccc',fill: '#FAD4D5','transform-center-x': '7.4100395','transform-center-y': '19.192898','stroke-width': '0','stroke-opacity': '1'})
				.transform('m-0.29204511,0.84184917,0.64636533,-0.02478471,-368.52113,861.9997')
				.data('id', 'flowerSouthPath3');
				
				var flowerSouthPath4 = doll.path('M-804.866,302.642 c-10.59-6.74,10.619-25.382,6.518-3.984c4.776-8.457,17.193-8.96,6.794,2.938c6.823,1.897,16.26,5.854,4.373,9.288 c12.222,9.222-2.769,14.999-10.318,7.161C-804.962,318.48-814.298,312.91-804.866,302.642z')
				.attr({id: 'flowerSouthPath4','connector-curvature': '0',nodetypes: 'cccccc',fill: '#D45F60','transform-center-x': '7.4100395','transform-center-y': '19.192898','stroke-width': '0','stroke-opacity': '1'})
				.transform('m-0.29204511,0.84184917,0.64636533,-0.02478471,-368.52113,861.9997')
				.data('id', 'flowerSouthPath4');
								
				var flowerSouthPath5 = doll.path('M-805.943,304.413 c-6.353-4.043,6.368-15.224,3.909-2.39c2.866-5.07,10.313-5.372,4.075,1.763c4.094,1.139,9.754,3.513,2.623,5.573 c7.332,5.531-1.661,8.996-6.189,4.294C-806,313.914-811.602,310.572-805.943,304.413z')
				.attr({id: 'flowerSouthPath5','connector-curvature': '0',nodetypes: 'cccccc',fill: '#FCE6E7','transform-center-x': '7.4100395','transform-center-y': '19.192898','stroke-width': '0','stroke-opacity': '1'})
				.transform('m-0.29204511,0.84184917,0.64636533,-0.02478471,-368.52113,861.9997')
				.data('id', 'flowerSouthPath5');
				
				console.log(
					basePath,
					headPath,
					bellyPath,
					leftHandPath,
					rightHandPath,
					leftArmPath,
					rightArmPath,
					bowPath,
					facePath,
					leftCheekPath,
					rightCheekPath,
					leftEyeBrowPath,
					rightEyeBrowPath,
					hairPath,
					leftEyeLashPath,
					rightEyeLashPath,
					leftEyePath,
					rightEyePath,
					nosePath,
					lipsPath,
					leafSouthPath1,
					leafSouthPath2,
					leafSouthPath3,
					leafEastPath1,
					leafEastPath2,
					leafEastPath3,
					leafNorthPath1,
					leafNorthPath2,
					leafNorthPath3,
					leafWestPath1,
					leafWestPath2,
					leafWestPath3,
					flowerNorthPath1,
					flowerNorthPath2,
					flowerNorthPath3,
					flowerNorthPath4,
					flowerNorthPath5,
					flowerSouthPath1,
					flowerSouthPath2,
					flowerSouthPath3,
					flowerSouthPath4,
					flowerSouthPath5
				);
				doll.setViewBox(0, 0, w, h, true);
				//doll.setSize('100%', '100%');
				//doll.canvas.setAttribute('preserveAspectRatio', 'xMidYMid');
				//doll.canvas.setAttribute('meetOrSlice', 'meet');
				
			}
		};
	}
]);