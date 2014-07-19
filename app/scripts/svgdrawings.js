'use strict';

angular.module('personalApp.svgdrawings', [])

.directive('appdirMobileNavSvgButton', [
    'AppservSvgSource',
    'AppfactSvgDrawing',
    function(SvgSource, SvgDrawing) {
        return {
            restrict: 'A',
            link: function(scope, iElement) {
                //console.log(scope, iElement);
                var button = new Raphael(iElement[0]);
                var buttonSource = SvgSource.flower1();
                var buttonDrawing = new SvgDrawing(button, buttonSource);
                var pageSettings = scope.pageLayoutSettings;
                
                buttonDrawing.drawsvg();
                
                var animateButton = function(navOn) {
                    var defColor = buttonDrawing.source.defColor;
                    var sectionColor = scope.getCurrentPalette();
                    var mainColor = (navOn) ? sectionColor.main : defColor.bottomColor;
                    var contraColor = (navOn) ? sectionColor.contra : defColor.topColor;
                    var circleColor = (navOn) ? defColor.circleColorOn : defColor.circleColorOff;
                    for(var i = 0; i < 3; i++) {
                        var colors = [mainColor, contraColor, circleColor];
                        var color = colors[i];
                        console.log(color);
                        buttonDrawing.animatePath(i, 'fill', color, pageSettings.transMsTime);
                    }
                };
                
                scope.$on('mobilenav::on', function() {
                    console.log('svg drawing colors navigation on');
                    animateButton(true);
                });
                
                scope.$on('mobilenav::off', function() {
                    console.log('svg drawing colors navigation off');
                    animateButton(false);
                });
                
                scope.$on('statechange::success', function() {
                    if(scope.mobileNavOn && scope.currentState.currentSectionRef >= 0) {
                        animateButton(true);
                    }
                });
            }
        };
    }
])

.factory('AppfactSvgDrawing', [
    'AppservUtils',
	function(AppservUtils) {
		return function(svgHolderElement, svgSource) {
			this.rootel = svgHolderElement;
            this.id = 'svg' + AppservUtils.uniqueid();
            this.source = svgSource;
            this.shape = null;
            this.paths = [];
			this.drawsvg = function() {
                var _root = this;
                angular.forEach(_root.source.paths, function(_path) {
                    //console.log(_path);
                    var _p = null;
                    switch(_path.pathtype) {
                        case 'path':
                            _p = _root.rootel.path(_path.path);
                            break;
                        case 'circle':
                            _p = _root.rootel.circle(_path.path.cx, _path.path.cy, _path.path.r);
                            break;
                    }
                    _root.paths.push(_p);
                    _path.make(_p);
                });
                _root.rootel.setViewBox(0, 0, _root.source.size.w, _root.source.size.h, true);
                _root.rootel.canvas.setAttribute('preserveAspectRatio', _root.source.aspectratio);
            };
            this.animatePath = function(_pathArrPos, animPropertyName, animPropertyValue, animTime) {
                var _anim = {};
                _anim[animPropertyName] = animPropertyValue;
                var anim = Raphael.animation(_anim, animTime);
                var animPath = this.paths[_pathArrPos];
                animPath.animate(anim);
            };
        };
    }
])

.service('AppservSvgSource', [
    function() {
        this.flower1 = function() {
            var flower1Colors = {
                bottomColor: '#D4D4D4',
                topColor: '#F8F8F8',
                circleColorOff: '#FFFFFF',
                circleColorOn: '#F9BA1F'
            };
            
            var flower1 = {
                aspectratio: 'xMidYMax',
                size: {
                    w: 92.0806,
                    h: 94.0776
                },
                defColor: flower1Colors,
                paths: [
                    {
                        pathid: 'flower_path1',
                        color: flower1Colors.bottomColor,
                        pathtype: 'path',
                        path: 'M59.7466,68.814c-0.0132-5.835-2.9722-11.147-6.1426-15.1699c4.0366,3.1494,9.3633,6.0845,15.1997,6.0713 c12.5869-0.0298,22.7578-13.7661,22.7578-13.7661S81.3267,32.2607,68.7412,32.29c-5.8354,0.0142-11.1494,2.9727-15.1738,6.145 c3.1523-4.0396,6.0884-9.3667,6.0742-15.2007C59.6138,10.6484,45.877,0.4775,45.877,0.4775S32.188,10.7109,32.2163,23.2974 c0.0127,5.834,2.9736,11.1479,6.145,15.1709c-4.0396-3.1519-9.3662-6.0864-15.2002-6.0723 C10.5747,32.4233,0.4019,46.1616,0.4019,46.1616s10.2368,13.688,22.8218,13.6577c5.8354-0.0127,11.1494-2.9727,15.1694-6.1421 c-3.1514,4.0376-6.084,9.3652-6.0713,15.1992C32.3506,81.4624,46.062,93.6143,46.062,93.6143S59.7744,81.3999,59.7466,68.814z',
                        make: function(_path) {
                            _path.attr({
                                'id': this.pathid,
                                'fill': this.color,
                                'stroke-width': '0',
                                'stroke-opacity': '1'
                            })
                            .data('id', this.pathid);
                        }
                    },
                    {
                        pathid: 'flower_path2',
                        color: flower1Colors.topColor,
                        pathtype: 'path',
                        path: 'M40.5991,67.915c3.4824-3.501,4.8931-8.4497,5.4048-12.7554c0.5278,4.3032,1.9614,9.2471,5.4609,12.7324 c7.5503,7.5137,21.8608,5.3813,21.8608,5.3813s2.0674-14.3184-5.4839-21.834c-3.5024-3.4844-8.4536-4.894-12.7573-5.4043 c4.3042-0.5322,9.2485-1.9624,12.7339-5.4639c7.5151-7.5503,5.3823-21.8594,5.3823-21.8594s-14.3193-2.0684-21.8364,5.4834 c-3.4824,3.4985-4.8911,8.4512-5.4033,12.7573c-0.5303-4.3052-1.9639-9.248-5.4609-12.7334 c-7.5527-7.5151-21.8618-5.3809-21.8618-5.3809s-2.0669,14.3198,5.4834,21.8325c3.5,3.4858,8.4521,4.8936,12.7583,5.4048 c-4.3037,0.5312-9.2476,1.9624-12.7329,5.4639c-7.5161,7.5483-5.3823,21.8599-5.3823,21.8599S33.0845,75.4658,40.5991,67.915z',
                        make: function(_path) {
                            _path.attr({
                                'id': this.pathid,
                                'fill': this.color,
                                'stroke-width': '0',
                                'stroke-opacity': '1'
                            })
                            .data('id', this.pathid);
                        }
                    },
                    {
                        pathid: 'flower_path3',
                        color: flower1Colors.circleColorOff,
                        pathtype: 'circle',
                        path: {
                            cx: 45,
                            cy: 46,
                            r: 5
                        },
                        make: function(_path) {
                            _path.attr({
                                'id': this.pathid,
                                'fill': this.color,
                                'stroke-width': '0',
                                'stroke-opacity': '1'
                            })
                            .data('id', this.pathid);
                        }
                    }
                ]
            };
            return flower1;
        };
    }
]);