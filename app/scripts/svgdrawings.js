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
				paper.setViewBox(0, 0, w, h, true);
				paper.setSize('100%', '100%');
				//paper.canvas.setAttribute('preserveAspectRatio', 'xMidYMid');
				//paper.canvas.setAttribute('meetOrSlice', 'meet');
				var path = 'M ' + w / 2 + ' ' + h / 2;
				paper.circle(w / 2,h / 2,Math.random() * 60 + 2).
				attr('fill', 'rgb('+Math.random() * 255+',0,0)').
				attr('opacity', 0.5);
				for (var i = 0; i < 10; i++){
					var x = Math.random() * w;
					var y = Math.random() * h;
					paper.circle(x,y,Math.random() * 60 + 2).
					attr('fill', 'rgb('+Math.random() * 255+',0,0)').
					attr('opacity', 0.5);
					path += 'L ' + x + ' ' + y + ' ';
				}
				paper.path(path).attr('stroke','#ffffff').attr('stroke-opacity', 0.2);
			}
		};
	}
]);