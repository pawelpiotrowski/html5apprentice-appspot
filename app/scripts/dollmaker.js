'use strict';

angular.module('personalApp.dollmaker', [])

.directive('appdirMakeNavDoll', [
    'AppfactDollCollection',
    'AppservDesignDoll',
    'AppservAudio',
    '$timeout',
    function(AppfactDollCollection, AppservDesignDoll, AppservAudio, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, iElement) {

                var dollCollection = new AppfactDollCollection();
                var navDollCounter = scope.$index;
                var navDollWrapper = iElement;
                var navDollSize = navDollCounter + 1;

                var navDoll = AppservDesignDoll.please(
                    navDollCounter,
                    navDollWrapper,
                    navDollSize,
                    scope.sections[navDollCounter].palette,
                    scope.sections[navDollCounter].slug.toUpperCase()
                );

                function navDollClickCallback() {
                    console.log('doll click animation callback');
                    console.log(scope.section.slug);
                    scope.changeLocation(scope.section.slug);
                }
                
                function navDollAwayCallback() {
                    console.log('away callback');
                }
                
                function navDollClick() {
                    console.log('doll clicked');
                    navDoll.action('click', navDollClick, false);
                    var others = dollCollection.getOthers(navDoll);
                    angular.forEach(others, function(other, i) {
                        var clbk = (i === others.length - 1) ? navDollClickCallback : navDollAwayCallback;
                        other.goAway(clbk);
                    });

                    var closeClbk = function() {
                        $timeout(function() {
                            navDoll.kiss();
                        }, 200);
                    };

                    navDoll.close(closeClbk);
                    removeCursorPointer();
                }
                function cursorPointerOn() {
                    scope.$emit('htmlclass::cursorPointer', true);
                    navDoll.open(AppservAudio.playSound(navDollCounter,0));
                }
                function cursorPointerOff() {
                    scope.$emit('htmlclass::cursorPointer', false);
                    navDoll.close();
                }
                function removeCursorPointer() {
                    navDoll.action('hover', [cursorPointerOn, cursorPointerOff], false);
                    cursorPointerOff();
                }
                navDoll.make();
                navDoll.action('click', navDollClick, true);
                navDoll.action('hover', [cursorPointerOn, cursorPointerOff], true);
                dollCollection.addDoll(navDoll);
                scope.$on('$destroy', function() {
                    removeCursorPointer();
                });
            }
        };
    }
])

.directive('appdirMakeSectionDoll', [
    'AppservDesignDoll',
    function(AppservDesignDoll) {
        return {
            restrict: 'A',
            link: function(scope, iElement) {

                // sectionRef, element, size, palette
                var sectionRef = scope.currentState.currentSectionRef;
                var size = sectionRef + 1;
                var sectionPalette = scope.getCurrentPalette();
                var sectionDoll = AppservDesignDoll.please(sectionRef, iElement, size, sectionPalette);

                function navDollClick() {
                    sectionDoll.kiss();
                }
                function cursorPointerOn() {
                    scope.$emit('htmlclass::cursorPointer', true);
                }
                function cursorPointerOff() {
                    scope.$emit('htmlclass::cursorPointer', false);
                }
                function removeCursorPointer() {
                    sectionDoll.action('hover', [cursorPointerOn, cursorPointerOff], false);
                    cursorPointerOff();
                }
                sectionDoll.make();
                sectionDoll.action('click', navDollClick, true);
                sectionDoll.action('hover', [cursorPointerOn, cursorPointerOff], true);

                scope.$on('$destroy', function() {
                    removeCursorPointer();
                });
            }
        };
    }
])

.service('AppservDesignDoll', [
    'AppfactDoll',
    function(AppfactDoll) {
        this.please = function(sectionRef, element, size, palette, innerText) {


            var dollReference = sectionRef;
            var dollWrapper = element;
            var dollRaphael = new Raphael(element[0]);
            var dollSize = size;
            var dollInnerText = (angular.isDefined(innerText)) ? innerText : '';

            var dollCustomColors = {
                bottom1Base: palette.contra,
                bottom4Body: palette.main,
                top12Base: palette.contra,
                top13Head: palette.main,
                top14Bow: palette.main,
                top22Hair: palette.extension[0],
                top20LeftEyebrow: palette.extension[1],
                top21RightEyebrow: palette.extension[1],
                top23LeftEyelash: palette.extension[2],
                top24RightEyelash: palette.extension[2],
                top25LeftEye: palette.extension[2],
                top26RightEye: palette.extension[2],
                top27Nose: palette.extension[3],
                top28Lips: palette.extension[4]
            };

            var dollCustomPaths = dollReference;
            var dollCustomAnimation = (dollReference === 0) ? false : { kiss: dollReference - 1 };

            return new AppfactDoll(
                dollRaphael,
                dollSize,
                dollWrapper,
                dollCustomColors,
                dollCustomPaths,
                dollCustomAnimation,
                dollInnerText
            );
        };
    }
])

.factory('AppfactDollCollection', [
    function() {
        var dolls = [];
        return function() {
            this.addDoll = function(doll) {
                dolls.push(doll);
            };
            this.getAll = function() {
                return angular.extend([], dolls);
            };
            this.getOthers = function(doll) {
                var _otherDolls = [];
                angular.forEach(dolls, function(_doll) {
                    if(doll.id !== _doll.id) {
                        _otherDolls.push(_doll);
                    }
                });
                return _otherDolls;
            };
        };
    }
])

.factory('AppfactDoll', [
    'AppservDoll',
    'AppservUtils',
    '$timeout',
    function(AppservDoll, AppservUtils, $timeout) {
        return function(doll, dollsize, dollWrapper, colors, pathsRef, animationRef, dollText) {
            this.id = AppservUtils.uniqueid();
            this.el = doll;
            this.wrapper = dollWrapper;
            this.scale = 1 - dollsize / 10;
            this.pathColors = (colors) ? colors : {};
            this.dollShape = null;
            this.dollBottom = null;
            this.dollTop = null;
            this.dollOuter = null;
            this.dollPaths = {};
            this.customPaths = (angular.isNumber(pathsRef) && AppservDoll.customPaths[pathsRef]) ? AppservDoll.customPaths[pathsRef] : {};
            this.customAnimation = (animationRef) ? animationRef : false;
            this.animated = false;
            this.openingAnimation = null;
            this.closingAnimation = null;
            this.dollText = dollText;
            this.make = function() {

                var doll = this.el;
                var	dollRef = AppservDoll.paths;
                var	dollRoot = this;

                var txt = dollRoot.dollText;
                var txtStyle = AppservDoll.textStyle;
                var txtCoords = AppservDoll.textCoords;

                var prevPath = '';
                dollRoot.dollBottom = doll.set();
                dollRoot.dollTop = doll.set();

                angular.forEach(AppservDoll.pathOrder, function(pathName) {

                    var _pathNamePart = pathName.substr(0,3);

                    var thisPath = (pathName in dollRoot.customPaths) ? dollRoot.customPaths[pathName] : dollRef[pathName];
                    dollRoot.dollPaths[pathName] = doll.path(thisPath.path)
                    .attr('fill', (thisPath.name in dollRoot.pathColors) ? dollRoot.pathColors[thisPath.name] : thisPath.color);
                    thisPath.make(dollRoot.dollPaths[pathName]);

                    if(_pathNamePart === 'bot') {
                        dollRoot.dollBottom.push(dollRoot.dollPaths[pathName]);
                    } else if(_pathNamePart === 'top') {
                        // adding text path between 
                        if(prevPath === 'bot') {
                            var txtPath = doll.text(txtCoords.x, txtCoords.y, txt);

                            txtPath.attr(txtStyle);

                            txtPath.insertBefore(dollRoot.dollPaths[pathName]);
                            dollRoot.dollBottom.push(txtPath);
                        }
                        dollRoot.dollTop.push(dollRoot.dollPaths[pathName]);
                    } else if(_pathNamePart === 'sha') { // shape
                        dollRoot.dollOuter = dollRoot.dollPaths[pathName];
                    }

                    prevPath = _pathNamePart;
                });

                doll.setViewBox(0, 0, AppservDoll.svgSize.w, AppservDoll.svgSize.h, true);
                //doll.setSize('100%', '100%');
                doll.canvas.setAttribute('preserveAspectRatio', 'xMidYMax');

                this.dollShape = doll.set();
                this.dollShape.push(this.dollBottom, this.dollTop, this.dollOuter);
                this.dollShape.scale(this.scale,this.scale,AppservDoll.svgSize.w / 2, AppservDoll.svgSize.h);

            };
            this.action = function(eName, eHandler, addOrRemove) {
                switch(eName) {
                    case 'click':
                        if(addOrRemove) {
                            this.dollOuter.click(eHandler);
                        } else {
                            this.dollOuter.unclick(eHandler);
                        }
                        break;
                    case 'hover':
                        if(addOrRemove) {
                            this.dollOuter.hover(eHandler[0], eHandler[1]);
                        } else {
                            this.dollOuter.unhover(eHandler[0], eHandler[1]);
                        }
                        break;
                }
            };
            this.animateGestureTo = function() {
                console.log('for animating state without reversing it to origin');
            };
            this.animateGesture = function(ao) {
                if(this.animated) { return; }
                console.log('animate gesture inside');
                this.animated = true;
                var that = this;
                angular.forEach(ao.animationRef, function(aPath, pathIndex) {

                    var originPath = that.dollPaths[aPath.reference];
                    var pathAttr = originPath.attrs.path;
                    var pathString = AppservDoll.getPathsString(pathAttr);
                    var animPath = aPath.path;

                    var animFinished = function() {
                        that.animated = false;
                        if(angular.isFunction(ao.animationCallback)) {
                            ao.animationCallback();
                        }
                    };

                    var _animFinished = (pathIndex === ao.animationPathLast) ? animFinished : null;

                    var animOut = Raphael.animation({ path: pathString }, ao.animationTimeOut, ao.animationEase, _animFinished);

                    var animOutClbk = function() {
                        originPath.animate(animOut.delay(ao.animationDelay));
                    };
                    var animIn = Raphael.animation({ path: animPath }, ao.animationTimeIn, ao.animationEase, animOutClbk);
                    originPath.animate(animIn);
                });
            };
            this.kiss = function(kissCallback) {
                var _animationRef = AppservDoll.animationPaths.kiss;

                var animateCustom = (
                    this.customAnimation &&
                    angular.isObject(this.customAnimation) &&
                    'kiss' in this.customAnimation &&
                    AppservDoll.customAnimation.kiss[this.customAnimation.kiss]
                );

                if(animateCustom) {
                    _animationRef = AppservDoll.customAnimation.kiss[this.customAnimation.kiss];
                }
                var animationClbk = function() {
                    console.log('KISSED! :* calling callback if exist');
                    if(angular.isFunction(kissCallback)) { kissCallback(); }
                };
                var animationKissObj = {
                    animationEase: 'linear',
                    animationRef: _animationRef,
                    animationPathLast: _animationRef.length - 1,
                    animationTimeIn: 250,
                    animationDelay: 500,
                    animationTimeOut: 150,
                    animationCallback: animationClbk
                };
                this.animateGesture(animationKissObj);
            };
            this.goAway = function(clbk) {
                var dollWrapper = this.wrapper[0];
                var walkingJump = TweenMax.to(dollWrapper, 0.04, { css: { y: '-10px' }, delay: 0.6, repeat: -1, yoyo: true, ease: 'Linear.easeNone' });
                var wentAway = function() {
                    console.log('tween finished');
                    walkingJump.kill();
                    if(angular.isFunction(clbk)) { $timeout(function() { clbk(); }, 100); }
                };
                TweenMax.to(dollWrapper, 2, { css: { x: window.innerWidth }, delay: 0.5, ease: 'Power1.easeIn', onComplete: wentAway });
                console.log('PLAY AWAY SOUND');
            };

            // this is rather internal serves open and close
            this._toggle = function(dirUpDown, clbk) {
                var dollRoot = this;
                var _scale = dollRoot.scale;
                var _transY = (dirUpDown) ? 40 * _scale : 0;
                var _scaleW = AppservDoll.svgSize.w / 2;
                var _scaleH = AppservDoll.svgSize.h;

                // for scaling outer path
                var _sx = _scale * 0.1;
                var _sy = _scale * 0.18;

                var _scaleOuterX = (dirUpDown) ? _scale + _sx : _scale;
                var _scaleOuterY = (dirUpDown) ? _scale + _sy : _scale;

                var _trans = 't0,-'+_transY+'s'+_scale+','+_scale+','+_scaleW+','+_scaleH;
                var _transOuter = 's'+_scaleOuterX+','+_scaleOuterY+','+_scaleW+','+_scaleH;
                var _thisAnimRefStr = (dirUpDown) ? 'openingAnimation' : 'closingAnimation';
                var _otherAnimRefStr = (dirUpDown) ? 'closingAnimation' : 'openingAnimation';
                var _animEasing = (dirUpDown) ? 'bounce' : 'linear';
                var _animTime = (dirUpDown) ? 250 : 150;

                if(dollRoot[_otherAnimRefStr]) {
                    dollRoot.dollTop.stop(dollRoot[_otherAnimRefStr]);
                    dollRoot[_otherAnimRefStr] = null;
                }

                dollRoot.dollOuter.transform(_transOuter);
                // this is hack for firing animation clbk for a set of paths once
                var _clbkCounter = 0;
                var _clbk = function() {
                    _clbkCounter++;
                    if(_clbkCounter === dollRoot.dollTop.length) {
                        dollRoot[_thisAnimRefStr] = null;
                        if(angular.isFunction(clbk)) { clbk(); }
                    }
                };

                dollRoot[_thisAnimRefStr] = Raphael.animation({
                    transform: _trans
                }, _animTime, _animEasing, _clbk);

                dollRoot.dollTop.animate(dollRoot[_thisAnimRefStr]);

            };

            this.open = function(clbk) {
                if(!this.openingAnimation) {
                    this._toggle(true, clbk);
                }
            };

            this.close = function(clbk) {
                if(!this.closingAnimation) {
                    this._toggle(false, clbk);
                }
            };
        };
    }
])

.service('AppservNewDoll', [
    function() {
        this.svgSize = {
            h: 254,
            w: 134
        };
        this.getPathsString = function(pathsArray) {
            var pathsString = '';
            angular.forEach(pathsArray, function(p) {
                pathsString += p.toString()+' ';
            });
            return pathsString;
        };
        this.customPaths = [
            {
                lipsPath: {
                    name: 'lipsPath',
                    color: '#D45714',
                    path: 'M52.3271,67.2861c0.9131,3.5283,6.9858,9.3008,13.9229,9.3394c7.0986-0.0513,13.876-5.8691,14.2617-9.3394 C79.6992,69.6123,71.5,72.042,66.2085,72.042C60.8335,72.042,53.1401,69.6123,52.3271,67.2861z',
                    make: function(dollpath) {
                        dollpath.attr({
                            'id': this.name,
                            'stroke-width': '0',
                            'stroke-opacity': '1'
                        })
                        .data('id', this.name);
                    }
                },
                leftEyePath: {
                    name: 'leftEyePath',
                    color: '#29190F',
                    path: 'M60.2319,53.583c0-1.5249-1.8389-2.7568-4.1035-2.7568c-2.2656,0-4.1045,1.2319-4.1045,2.7568 c0,1.5239,1.8389,2.771,4.1045,2.771C58.3931,56.354,60.2319,55.1069,60.2319,53.583z',
                    make: function(dollpath) {
                        dollpath.attr({
                            'id': this.name,
                            'stroke-width': '0',
                            'stroke-opacity': '1'
                        })
                        .data('id', this.name);
                    }
                },
                rightEyePath: {
                    name: 'rightEyePath',
                    color: '#29190F',
                    path: 'M80.2324,53.583c0-1.5244-1.8398-2.7568-4.1045-2.7568c-2.2666,0-4.1045,1.2324-4.1045,2.7568 c0,1.5234,1.8398,2.771,4.1045,2.771S80.2324,55.1064,80.2324,53.583z',
                    make: function(dollpath) {
                        dollpath.attr({
                            'id': this.name,
                            'stroke-width': '0',
                            'stroke-opacity': '1'
                        })
                        .data('id', this.name);
                    }
                }
            },
            {
                lipsPath: {
                    name: 'lipsPath',
                    color: '#D45714',
                    path: 'M58.228,72.689 c3.4194,3.792,6.4272,5.1255,11.1206,5.1255c7.0986-0.0732,12.7441-7.5625,14.1616-11.8706C78.6475,72.731,71.2275,74.167,69,74.377 C65.7725,74.731,61.5596,74.1851,58.228,72.689z',
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
                leftEyeBrowPath: {
                    name: 'leftEyeBrowPath',
                    color: '#502D17',
                    path: 'M53.5405,47.8975 c5.771,0.667,7.521,0.875,8.4131-1.2812c-4.1514-0.0488-10.4492-0.0728-11.085,0.0552 C50.8052,47.7671,51.707,48.564,53.5405,47.8975z',
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
                    path: 'M73.0303,50.9551 c-2.6885,0.2505-3.7227-0.1816-2.6885-0.4551c4.1758-1.0669,6.1982-1.958,10.4131-3.4248 C81.002,48.5015,74.4365,50.7988,73.0303,50.9551z',
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
                leftEyeLashPath: {
                    name: 'leftEyeLashPath',
                    color: '#29190F',
                    path: 'M59.667,51.8286 c-7.812-0.2363-9.231,0.0693-9.418,1.8872c3.2402-0.1089,5.5732-0.1406,9.5903-0.001 C60.3745,53.6108,59.9521,51.7925,59.667,51.8286C59.3813,51.8638,59.667,51.8286,59.667,51.8286z',
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
                rightEyeLashPath: {
                    name: 'rightEyeLashPath',
                    color: '#29190F',
                    path: 'M70.6685,54.2051 c7.0088-5.4482,10.5254-0.3438,12.2051,0.2266c-1.3965,2.2207-1.9062-1.9316-11.8887,0.6211 C70.2974,55.0527,70.3042,54.2295,70.6685,54.2051C72.5913,53.3311,70.6685,54.2051,70.6685,54.2051z',
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
                    path: 'M59.4209,56.0957c0-1.7656-0.9688-4.1875-3.3281-4.1875 c-2.0625,0-3.3438,2.1562-3.3438,4.1875c0,2.0781,1.4062,4.1875,3.3438,4.1875C58.5615,60.2832,59.4209,57.877,59.4209,56.0957z',
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
                    path: 'M80.0771,55.6426 c0.2031-1.6094-1.2344-2.5195-3.9492-2.4375c-2.0913,0.063-4.0195,0.9219-3.707,2.4375c0.3994,1.938,2.25,2.4375,3.707,2.4375 C77.749,58.0801,79.8413,57.5122,80.0771,55.6426z',
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
                    path: 'M69.7104,64.7642c-1.2632,1.4141-3.6875,2.0503-5.4263,1.4233c-1.082-0.3882-1.7168-1.4131-1.6841-2.2905 c-0.4712,1.2417,0.1152,2.4634,1.6079,3.001c1.9067,0.686,4.5649-0.0044,5.9355-1.5435c1.1118-1.2427,1.0396-2.6611-0.0342-3.519 C70.584,62.6055,70.5195,63.8584,69.7104,64.7642z',
                    make: function(dollpath) {
                        dollpath.attr({
                            'id': this.name,
                            'stroke-width': '0',
                            'stroke-opacity': '1'
                        })
                        .data('id', this.name);
                    }
                }
            },
            {
                lipsPath: {
                    name: 'lipsPath',
                    color: '#D45714',
                    path: 'M55.4048,72.6743c0.7305,4.0322,5.7236,8.3164,11.2734,8.3604c5.6792-0.0586,10.9663-4.3945,11.2749-8.3604 c-3.8809,0.3613-6.8809,0.7363-11.0151,0.4863C61.8218,73.3481,59.0718,73.2856,55.4048,72.6743z',
                    make: function(dollpath) {
                        dollpath.attr({
                            'id': this.name,
                            'stroke-width': '0',
                            'stroke-opacity': '1'
                        })
                        .data('id', this.name);
                    }
                },
                leftEyeBrowPath: {
                    name: 'leftEyeBrowPath',
                    color: '#502D17',
                    path: 'M58.8364,47.5869c0.8047,0.208,0.6436,1.3999-0.1318,1.0708c-3.2021-1.168-6.0322-1.1167-10.0762,0.0439 C53.146,44.876,57.6636,47.1768,58.8364,47.5869z',
                    make: function(dollpath) {
                        dollpath.attr({
                            'id': this.name,
                            'stroke-width': '0',
                            'stroke-opacity': '1'
                        })
                        .data('id', this.name);
                    }
                },
                rightEyeBrowPath: {
                    name: 'rightEyeBrowPath',
                    color: '#502D17',
                    path: 'M83.6934,48.3892c-4.0439-1.1606-6.874-1.2119-10.0762-0.0439c-0.7754,0.3291-0.9365-0.8628-0.1318-1.0708 C74.6582,46.8643,79.1758,44.5635,83.6934,48.3892z',
                    make: function(dollpath) {
                        dollpath.attr({
                            'id': this.name,
                            'stroke-width': '0',
                            'stroke-opacity': '1'
                        })
                        .data('id', this.name);
                    }
                },
                leftEyeLashPath: {
                    name: 'leftEyeLashPath',
                    color: '#29190F',
                    path: 'M59.5547,52.5552c0.2275,0.3481,0.6499,1.0879,0.2114,1.7285c-2.9678-1.3281-6.7012-1.2568-9.147-0.1558 c-0.6357-2.7734,5.1655-3.1567,8.4316-1.9722C59.0508,52.1558,59.2949,52.2524,59.5547,52.5552z',
                    make: function(dollpath) {
                        dollpath.attr({
                            'id': this.name,
                            'stroke-width': '0',
                            'stroke-opacity': '1'
                        })
                        .data('id', this.name);
                    }
                },
                rightEyeLashPath: {
                    name: 'rightEyeLashPath',
                    color: '#29190F',
                    path: 'M73.7607,52.1558c3.2666-1.1846,9.0674-0.8013,8.4316,1.9722c-2.4453-1.1011-6.1787-1.1724-9.1465,0.1558 c-0.4395-0.6406-0.0166-1.3804,0.2109-1.7285C73.5166,52.2524,73.7607,52.1558,73.7607,52.1558z',
                    make: function(dollpath) {
                        dollpath.attr({
                            'id': this.name,
                            'stroke-width': '0',
                            'stroke-opacity': '1'
                        })
                        .data('id', this.name);
                    }
                },
                leftEyePath: {
                    name: 'leftEyePath',
                    color: '#29190F',
                    path: 'M59.3682,55.2139c0-1.7485-1.8389-3.1611-4.1035-3.1611c-2.2656,0-4.1045,1.4126-4.1045,3.1611 c0,1.7471,1.8389,3.1763,4.1045,3.1763C57.5293,58.3901,59.3682,56.9609,59.3682,55.2139z',
                    make: function(dollpath) {
                        dollpath.attr({
                            'id': this.name,
                            'stroke-width': '0',
                            'stroke-opacity': '1'
                        })
                        .data('id', this.name);
                    }
                },
                rightEyePath: {
                    name: 'rightEyePath',
                    color: '#29190F',
                    path: 'M81.6523,55.0645c0-1.748-1.8398-3.1611-4.1045-3.1611c-2.2666,0-4.1045,1.4131-4.1045,3.1611 c0,1.7461,1.8398,3.1763,4.1045,3.1763S81.6523,56.8105,81.6523,55.0645z',
                    make: function(dollpath) {
                        dollpath.attr({
                            'id': this.name,
                            'stroke-width': '0',
                            'stroke-opacity': '1'
                        })
                        .data('id', this.name);
                    }
                },
                nosePath: {
                    name: 'nosePath',
                    color: '#D45714',
                    path: 'M68.709,65.2041c-1.3218,0.8662-3.4106,0.8555-4.6758-0.0249c-0.7866-0.5454-1.0762-1.5073-0.8618-2.2065 c-0.6475,0.8975-0.4375,2.0078,0.6475,2.7622c1.3872,0.9634,3.6753,0.9805,5.1108,0.0381c1.1621-0.7612,1.4102-1.9175,0.7324-2.8398 C69.877,63.6548,69.5547,64.6494,68.709,65.2041z',
                    make: function(dollpath) {
                        dollpath.attr({
                            'id': this.name,
                            'stroke-width': '0',
                            'stroke-opacity': '1'
                        })
                        .data('id', this.name);
                    }
                }
            }
        ];
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
                path: 'M69.2803,63.3301c-1.6519,1.0825-4.2627,1.0693-5.8438-0.0312c-0.9834-0.6816-1.3457-1.8843-1.0776-2.7578 c-0.8091,1.1216-0.5469,2.5093,0.8096,3.4526c1.7339,1.2041,4.5942,1.2256,6.3887,0.0474c1.4526-0.9512,1.7632-2.397,0.9146-3.5498 C70.7412,61.3936,70.3389,62.6367,69.2803,63.3301z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
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
        this.customAnimation = {
            kiss: [
                [
                    {
                        reference: 'lipsPath',
                        path: 'M56.2705,70.9653 c3.2285,4.2241,5.708,5.3076,10.312,5.3076c3.854,0,6.4585-0.771,9.8438-5.3076c-3.6562,3.3281-5.1978-3.5884-9.7188-0.9219 C62.145,67.5854,59.8325,74.127,56.2705,70.9653z'
                    },
                    {
                        reference: 'nosePath',
                        path: 'M69.2803,63.3301c-1.6519,1.0825-4.2627,1.0693-5.8438-0.0312c-0.9834-0.6816-1.3457-1.8843-1.0776-2.7578 c-0.8091,1.1216-0.5469,2.5093,0.8096,3.4526c1.7339,1.2041,4.5942,1.2256,6.3887,0.0474c1.4526-0.9512,1.7632-2.397,0.9146-3.5498 C70.7412,61.3936,70.3389,62.6367,69.2803,63.3301z'
                    },
                    {
                        reference: 'leftEyeBrowPath',
                        path: 'M53.5405,47.8975 c5.771,0.667,7.521,0.875,8.4131-1.2812c-4.1514-0.0488-10.4492-0.0728-11.085,0.0552 C50.8052,47.7671,51.707,48.564,53.5405,47.8975z',
                    },
                    {
                        reference: 'rightEyeBrowPath',
                        path: 'M71.0312,48.2539c-2.4062-1.6309-2.2266-1.5391-1.1562-1.5352c4.3086,0.0508,6.7559-0.1357,11.207-0.4619 C81.2812,49.375,71.8936,48.5625,71.0312,48.2539z'
                    },
                    {
                        reference: 'rightEyeLashPath',
                        path: 'M72.4629,51.9619c8.0049-0.3232,9.8691-0.5718,10.3125,1.8438c-3.1641-0.207-1.0938-0.0176-9.375-0.1875 c-0.6855-0.0605-1.3516,0.2466-1.2949-0.2632C71.8926,52.064,72.4629,51.9619,72.4629,51.9619z'
                    },
                    {
                        reference: 'leftEyePath',
                        path: 'M60.1069,53.585c0-1.1533-1.8389-1.085-4.1035-1.085 c-2.2656,0-4.1045-0.0684-4.1045,1.085c0,1.1523,1.8389,2.0952,4.1045,2.0952C58.2681,55.6802,60.1069,54.7373,60.1069,53.585z'
                    },
                    {
                        reference: 'rightEyePath',
                        path: 'M80.2319,53.585c0-1.1533-1.8389-1.085-4.1035-1.085c-2.2656,0-4.1045-0.0684-4.1045,1.085c0,1.1523,1.8389,2.0952,4.1045,2.0952C78.3931,55.6802,80.2319,54.7373,80.2319,53.585z'
                    }
                ],
                [
                    {
                        reference: 'lipsPath',
                        path: 'M59.3682,75.3335c3.6318,2.791,1.7603,5.6572,7.3101,5.7012C72.3574,80.9761,71,78.083,74.375,75.0835 c-2.083,0.5825-3.4258-5.2021-7.6963-1.875C62.5835,70.041,62.042,75.083,59.3682,75.3335z'
                    },
                    {
                        reference: 'leftEyeBrowPath',
                        path: 'M59.7852,47.9141c0.8262,0.0942,0.832,1.2969,0.0186,1.0786c-3.334-0.7109-6.1289-0.2661-9.9727,1.4463 C53.7725,46.0215,58.5664,47.6709,59.7852,47.9141z',
                    },
                    {
                        reference: 'rightEyeBrowPath',
                        path: 'M82.4902,50.126c-3.8428-1.7119-6.6387-2.1562-9.9717-1.4453c-0.8135,0.2178-0.8076-0.9854,0.0186-1.0791 C73.7559,47.3584,78.5488,45.709,82.4902,50.126z'
                    },
                    {
                        reference: 'leftEyePath',
                        path: 'M59.3682,55.2139c0.3877-2.3105-1.8389-3.1611-4.1035-3.1611c-2.2656,0-4.6938,0.9688-4.1045,3.1611 c0.4536,1.687,1.8384,1.7441,4.104,1.7441C57.5288,56.958,59.0791,56.937,59.3682,55.2139z'
                    },
                    {
                        reference: 'rightEyePath',
                        path: 'M81.6523,55.0645c0.3887-2.2515-1.8398-3.1611-4.1045-3.1611c-2.2666,0-4.5898,0.7432-4.1045,3.1611 c0.3438,1.7119,1.8398,1.8936,4.1045,1.8936S81.3555,56.7852,81.6523,55.0645z'
                    }
                ]
            ]
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
])


.service('AppservDoll', [
    function() {
        this.svgSize = {
            h: 300,
            w: 134
        };
        this.textCoords = {
            x: 67,
            y: 187
        };
        this.textStyle = {
            'font-family': '"VeljovicScriptLTW02-Bol", Palatino, "Palatino Linotype", "Palatino LT STD", Georgia, serif',
            'font-size': 16,
            'fill': '#222222'
        };
        this.getPathsString = function(pathsArray) {
            var pathsString = '';
            angular.forEach(pathsArray, function(p) {
                pathsString += p.toString()+' ';
            });
            return pathsString;
        };
        this.customPaths = [/*
            {
				top28Lips: {
					name: 'top28Lips',
					color: '#D45714',
					path: 'M52.3271,67.2861c0.9131,3.5283,6.9858,9.3008,13.9229,9.3394c7.0986-0.0513,13.876-5.8691,14.2617-9.3394 C79.6992,69.6123,71.5,72.042,66.2085,72.042C60.8335,72.042,53.1401,69.6123,52.3271,67.2861z',
					make: function(dollpath) {
						dollpath.attr({
							'id': this.name,
							'stroke-width': '0',
							'stroke-opacity': '1'
						})
						.data('id', this.name);
					}
				},
				top25LeftEye: {
					name: 'top25LeftEye',
					color: '#29190F',
					path: 'M60.2319,53.583c0-1.5249-1.8389-2.7568-4.1035-2.7568c-2.2656,0-4.1045,1.2319-4.1045,2.7568 c0,1.5239,1.8389,2.771,4.1045,2.771C58.3931,56.354,60.2319,55.1069,60.2319,53.583z',
					make: function(dollpath) {
						dollpath.attr({
							'id': this.name,
							'stroke-width': '0',
							'stroke-opacity': '1'
						})
						.data('id', this.name);
					}
				},
				top26RightEye: {
					name: 'top26RightEye',
					color: '#29190F',
					path: 'M80.2324,53.583c0-1.5244-1.8398-2.7568-4.1045-2.7568c-2.2666,0-4.1045,1.2324-4.1045,2.7568 c0,1.5234,1.8398,2.771,4.1045,2.771S80.2324,55.1064,80.2324,53.583z',
					make: function(dollpath) {
						dollpath.attr({
							'id': this.name,
							'stroke-width': '0',
							'stroke-opacity': '1'
						})
						.data('id', this.name);
					}
				}
			}
        */
        ];
        this.paths = {
            bottom1Base: {
                name: 'bottom1Base',
                color: '#ECC117',
                path: 'M6.899,198.667c5.242,22.376,13.385,49.222,25.254,66.276c-7.27,3.925-11.574,8.787-11.574,13.361 c0,9.898,20.111,17.256,46.923,17.256s46.922-7.357,46.922-17.256c0-4.822-4.775-9.975-12.776-14 c12.239-16.824,21.404-42.787,26.317-65.149C118.32,219.813,16.311,219.14,6.899,198.667z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
                        'stroke-width': '0',
                        'stroke-opacity': '1'
                    })
                    .data('id', this.name);
                }
            },
            bottom2Inner1: {
                name: 'bottom2Inner1',
                color: '#C9A897',
                path: 'M6.452,197.068 c6.068-22.196,117.264-22.781,122.099,0v0.406c-4.834,22.781-116.03,22.196-122.099,0V197.068z',
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
            bottom3Inner2: {
                name: 'bottom3Inner2',
                color: '#FAF3EE',
                path: 'M12.557,197.089 c5.461-19.977,105.538-20.503,109.889,0v0.365c-4.351,20.503-104.427,19.977-109.889,0V197.089z',
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
            bottom4Body: {
                name: 'bottom4Body',
                color: '#E56A19',
                path: 'M6.633,197.474 c5.23,22.609,13.438,50.107,25.521,67.467c-3.319,1.793-6.009,3.779-7.965,5.846c9.312,7.344,22.699,11.591,41.924,11.591 c20.361,0,34.166-4.708,43.517-12.759c-2.074-1.891-4.764-3.703-7.981-5.322c12.545-17.246,21.854-44.074,26.671-66.803 C123.485,220.275,12.702,219.67,6.633,197.474L6.633,197.474z',
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
            bottom5LeftHand: {
                name: 'bottom5LeftHand',
                color: '#FDE5D6',
                path: 'M18.421,212.35c-2.8,0-5.396,0.705-7.592,1.896 c2.053,7.375,4.394,14.861,7.071,22.052c0.165,0.005,0.355,0.021,0.521,0.021c7.809,0,10.27-9.51,10.27-16.127 C28.691,213.576,26.23,212.35,18.421,212.35z',
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
            bottom6RightHand: {
                name: 'bottom6RightHand',
                color: '#FDE5D6',
                path: 'M116.709,212.35c2.8,0,5.396,0.705,7.592,1.896 c-2.053,7.375-4.423,14.861-7.101,22.052c-0.165,0.005-0.325,0.021-0.491,0.021c-7.808,0-10.27-9.51-10.27-16.127 C106.44,213.576,108.902,212.35,116.709,212.35z',
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
            bottom7LeftArm: {
                name: 'bottom7LeftArm',
                color: '#FAF3EE',
                path: 'M6.802,198.556c1.483,6.329,3.193,12.994,5.157,19.721c0.897,0.036,1.808,0.061,2.745,0.061 c7.795-0.058,12.283-3.021,14.781-7.795C17.805,207.904,9.161,203.899,6.802,198.556z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
                        'stroke-width': '0',
                        'stroke-opacity': '1'
                    })
                    .data('id', this.name);
                }
            },
            bottom8RightArm: {
                name: 'bottom8RightArm',
                color: '#FAF3EE',
                path: 'M105.753,210.8c2.525,4.619,6.982,7.48,14.633,7.538c0.938,0,1.848-0.024,2.745-0.061 c2.062-7.06,3.846-14.057,5.378-20.662C127.104,203.656,118.189,208.04,105.753,210.8z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
                        'stroke-width': '0',
                        'stroke-opacity': '1'
                    })
                    .data('id', this.name);
                }
            },
            bottom9Leaf1: {
                name: 'bottom9Leaf1',
                color: '#2C7B33',
                path: 'M37.058,218.298c7.395,2.658,14.346,2.452,19.764-0.074c2.101-0.98,3.963-2.32,5.541-3.967 c-7.359-0.201-14.617-0.762-21.35-1.678C39.654,214.185,38.33,216.074,37.058,218.298z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
                        'stroke-width': '0',
                        'stroke-opacity': '1'
                    })
                    .data('id', this.name);
                }
            },
            bottom10Leaf2: {
                name: 'bottom10Leaf2',
                color: '#2C7B33',
                path: 'M65.674,214.321c2.02,5.204,8.64,11.417,11.13,10.244c0.043-0.021,0.088-0.045,0.129-0.07 c1.341-0.826,1.668-1.601,1.384-2.228c-0.365-0.805-1.746-1.363-3.291-1.468c-1.685-0.114-4.413-3.239-6.153-6.462 C67.807,214.339,66.741,214.334,65.674,214.321z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
                        'stroke-width': '0',
                        'stroke-opacity': '1'
                    })
                    .data('id', this.name);
                }
            },
            bottom11Leaf3: {
                name: 'bottom11Leaf3',
                color: '#ACD195',
                path: 'M39.507,217.38c6.045,3.085,14.554,1.841,20.374-3.205c-5.957-0.229-11.811-0.698-17.344-1.398 C41.333,214.164,40.294,215.698,39.507,217.38z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
                        'stroke-width': '0',
                        'stroke-opacity': '1'
                    })
                    .data('id', this.name);
                }
            },
            top12Base: {
                name: 'top12Base',
                color: '#ECC117',
                path: 'M126.489,160.896c-1.693-27.546-20.877-35.705-20.808-55.662c0-27.348-6.282-55.229-39.297-54.79 c-33.021,0.44-39.297,27.441-39.297,54.79c0.192,22.427-20.81,34.056-20.81,55.662c0,0-2.566,23.821,0,35.086 c0.202,0.886,0.41,1.784,0.622,2.685c9.411,20.473,111.42,21.146,121.065,0.488c0.234-1.065,0.462-2.125,0.677-3.173 C130.974,184.607,126.489,160.896,126.489,160.896z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
                        'stroke-width': '0',
                        'stroke-opacity': '1'
                    })
                    .data('id', this.name);
                }
            },
            top13Head: {
                name: 'top13Head',
                color: '#E56A19',
                path: 'M66.365,50.354c-33.021,0.44-39.297,27.44-39.297,54.788 c0.078,9.069-3.309,16.371-7.372,23.282c12.113,9.522,28.931,13.284,47.516,13.284c20.003,0,34.019-2.804,47.369-13.141 c-4.327-6.878-8.952-13.566-8.918-23.425C105.662,77.794,99.38,49.915,66.365,50.354L66.365,50.354z',
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
            top14Bow: {
                name: 'top14Bow',
                color: '#E56A19',
                path: 'M66.475,139.092c-2.99,0-5.504,1.656-6.471,3.978 c-3.567,1.286-7.841,3.193-12.256,5.569c-10.431,5.614-16.268,13.473-16.268,13.473s11.077-1.228,21.508-6.843 c3.408-1.833,6.47-3.718,9.011-5.48c1.205,0.897,2.764,1.432,4.476,1.432H69.7c1.774,0,3.396-0.581,4.616-1.538 c2.193,1.505,4.669,3.062,7.357,4.596c10.324,5.895,20.823,7.268,20.823,7.268s-6.226-8.198-16.55-14.092 c-3.58-2.043-7.037-3.752-10.079-5.056c-1.14-1.967-3.471-3.307-6.168-3.307H66.475z',
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
            top15LeftArm: {
                name: 'top15LeftArm',
                color: '#FAF3EE',
                path: 'M31.012,163.508c0-11.579-6.194-27.184-15.832-27.616c-4.66,7.574-8.943,15.274-8.943,24.996 c0,0-2.566,23.828,0,35.094c0.192,0.844,0.403,1.716,0.604,2.574c2.359,5.343,11.003,9.348,22.684,11.987 C35.099,199.894,30.757,180.212,31.012,163.508z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
                        'stroke-width': '0',
                        'stroke-opacity': '1'
                    })
                    .data('id', this.name);
                }
            },
            top16RightArm: {
                name: 'top16RightArm',
                color: '#FAF3EE',
                path: 'M128.894,160.888c0-9.722-5.358-17.304-10.019-24.878c-9.638,0.432-14.756,15.919-14.756,27.498 c0.258,16.843-4.152,36.707,1.635,47.292c12.436-2.76,21.35-7.144,22.756-13.185c0.126-0.541,0.262-1.098,0.384-1.633 C131.46,184.716,128.894,160.888,128.894,160.888z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
                        'stroke-width': '0',
                        'stroke-opacity': '1'
                    })
                    .data('id', this.name);
                }
            },
            top17Face: {
                name: 'top17Face',
                color: '#FDE5D6',
                path: 'M94.527,105.967 c0,18.855-17.554,31.634-27.849,31.376c-9.859-0.247-27.849-12.521-27.849-31.376s12.468-34.141,27.849-34.141 C82.058,71.827,94.527,87.112,94.527,105.967z',
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
            top18LeftCheek: {
                name: 'top18LeftCheek',
                color: '#FBCCAB',
                path: 'M57.205,113.063c0,3.944-3.294,7.142-7.357,7.142s-7.358-3.197-7.358-7.142c0-3.944,3.295-7.141,7.358-7.141 S57.205,109.119,57.205,113.063z',
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
            top19RightCheek: {
                name: 'top19RightCheek',
                color: '#FBCCAB',
                path: 'M90.839,111.22c0,3.944-3.294,7.142-7.357,7.142c-4.064,0-7.358-3.197-7.358-7.142s3.294-7.142,7.358-7.142 C87.545,104.079,90.839,107.276,90.839,111.22z',
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
            top20LeftEyebrow: {
                name: 'top20LeftEyebrow',
                color: '#502D17',
                path: 'M50.877,91.573 c4.929-2.828,9.708,2.018,8.239,1.48c-3.203-1.167-6.033-1.117-10.077,0.045C48.671,90.654,51.686,87.529,50.877,91.573z',
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
            top21RightEyebrow: {
                name: 'top21RightEyebrow',
                color: '#502D17',
                path: 'M83.161,91.493 c0.805,0.208,0.644,1.4-0.131,1.071c-3.203-1.168-6.033-1.117-10.077,0.044C77.47,88.782,81.989,91.083,83.161,91.493z',
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
            top22Hair: {
                name: 'top22Hair',
                color: '#C87137',
                path: 'M66.672,71.832c-14.162,0-25.841,12.96-27.604,29.732 c6.735-2.81,14.528-9.459,19.165-14.211c3.325-3.407,7.34-7.708,10.015-12.518c2.676,4.809,6.69,9.11,10.016,12.518 c3.882,3.979,9.976,9.286,15.81,12.558C91.739,83.949,80.364,71.832,66.672,71.832z',
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
            top23LeftEyelash: {
                name: 'top23LeftEyelash',
                color: '#29190F',
                path: 'M60.437,97.151 c-5.195-2.301-9.724,0.678-9.866,2.108c3.065-1.494,5.886-1.737,10.027-1.001C61.158,98.149,60.622,97.126,60.437,97.151 C60.252,97.176,60.437,97.151,60.437,97.151z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
                        'connector-curvature': '0',
                        'stroke-width': '0',
                        'stroke-opacity': '1',
                        'nodetypes': 'ccczc'
                    })
                    .data('id', this.name);
                }
            },
            top24RightEyelash: {
                name: 'top24RightEyelash',
                color: '#29190F',
                path: 'M71.734,97.151 c5.195-2.301,9.723,0.678,9.865,2.108c-3.064-1.494-5.885-1.737-10.027-1.001C71.013,98.149,71.435,97.113,71.734,97.151 C72.033,97.188,71.734,97.151,71.734,97.151z',
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
            top25LeftEye: {
                name: 'top25LeftEye',
                color: '#29190F',
                path: 'M51.939,99.585c0-1.153,1.838-2.085,4.104-2.085 s4.104,0.932,4.104,2.085c0,1.152-1.838,2.095-4.104,2.095S51.939,100.737,51.939,99.585z',
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
            top26RightEye: {
                name: 'top26RightEye',
                color: '#29190F',
                path: 'M80.232,99.585c0-1.153-1.839-2.085-4.104-2.085 c-2.266,0-4.104,0.932-4.104,2.085c0,1.152,1.839,2.095,4.104,2.095C78.393,101.68,80.232,100.737,80.232,99.585z',
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
            top27Nose: {
                name: 'top27Nose',
                color: '#D45714',
                path: 'M61.935,106.89c-0.015,0.126-0.021,0.253-0.021,0.383 c0,2.099,2.021,3.801,4.509,3.801s4.501-1.702,4.501-3.801c0-0.129-0.007-0.257-0.021-0.383c-0.23,1.917-2.146,3.414-4.479,3.414 S62.167,108.807,61.935,106.89L61.935,106.89z',
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
            top28Lips: {
                name: 'top28Lips',
                color: '#D45714',
                path: 'M52.327,112.719 c0.913,5.04,7.155,10.395,14.092,10.45c7.099-0.073,13.707-5.493,14.092-10.45c-0.812,3.323-8.88,1.224-13.828,2.801 C61.194,113.972,53.14,116.042,52.327,112.719z',
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
            top29Leaf1: {
                name: 'top29Leaf1',
                color: '#2C7B33',
                path: 'M67.271,208.856c5.891,5.583,14.244,6.627,22.361,2.917c2.645-1.209,5.263-2.921,7.761-5.145 c-8.608-6.808-15.866-7.685-21.446-5.894c5.44-6.687,7.89-16.444,5.986-26.953c-11.972,7.09-16.464,15.505-17.244,22.859 c-2.866-6.818-9.591-13.583-23.095-16.926c1.289,11.39,7.131,20.506,15.09,25.091c-2.471-0.102-5.08,0.317-7.703,1.498 c-2.687,1.208-5.388,3.22-7.97,6.276c6.733,0.916,13.991,1.477,21.35,1.678c1.136-1.187,2.128-2.528,2.936-4.032v0.001 c-0.415,1.139-0.214,2.574,0.376,4.095c1.066,0.013,2.132,0.018,3.199,0.016C67.777,212.307,67.07,210.238,67.271,208.856z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
                        'stroke-width': '0',
                        'stroke-opacity': '1'
                    })
                    .data('id', this.name);
                }
            },
            top30Leaf2: {
                name: 'top30Leaf2',
                color: '#ACD195',
                path: 'M64.4,208.349l-0.003-0.002c-5.865,4.984-11.62,5.332-14.291,3.612c4.399-0.542,7.616-1.207,12.025-5.628 c-3.916-1.722-10.535-1.57-16.925,3.817c-0.954,0.804-1.85,1.683-2.67,2.628c5.533,0.701,11.387,1.17,17.344,1.398 C61.701,212.597,63.266,210.658,64.4,208.349z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
                        'stroke-width': '0',
                        'stroke-opacity': '1'
                    })
                    .data('id', this.name);
                }
            },
            top31Leaf3: {
                name: 'top31Leaf3',
                color: '#ACD195',
                path: 'M68.382,204.417c5.2,2.24,10.672,2.66,14.558,1.637c-1.667,2.346-6.632,3.991-13.251,1.769l0.001,0.002 c7.272,6.558,18.684,5.306,24.003-0.777c-3.48-3.257-8.242-4.881-12.754-5.329C75.496,201.177,70.413,202.346,68.382,204.417z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
                        'stroke-width': '0',
                        'stroke-opacity': '1'
                    })
                    .data('id', this.name);
                }
            },
            top32Flower1: {
                name: 'top32Flower1',
                color: '#D45F5F',
                path: 'M46.726,210.828c0.773,0.717,1.512,1.241,2.211,1.6c4.24,2.187,7.004-1.63,7.251-4.512 c2.646,0.799,4.558-0.287,5.64-1.928c1.355-2.055,1.406-4.976-0.031-6.154c1.917-2.865,1.344-7.681-1.765-9.736 c-1.929-1.275-4.831-1.488-8.72,0.486c-3.564-1.751-6.698-0.344-8.398,1.907c-1.422,1.88-1.845,4.349-0.687,6.062 c-3.515,5.02-2.53,9.044,0.118,10.997C43.55,210.438,45.099,210.898,46.726,210.828z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
                        'stroke-width': '0',
                        'stroke-opacity': '1'
                    })
                    .data('id', this.name);
                }
            },
            top33Flower2: {
                name: 'top33Flower2',
                color: '#FAD4D5',
                path: 'M46.507,210.36c0.773,0.718,1.514,1.24,2.212,1.601c4.239,2.185,7.003-1.632,7.25-4.514 c2.646,0.8,4.559-0.287,5.64-1.928c1.355-2.054,1.406-4.975-0.032-6.155c1.918-2.864,1.345-7.68-1.764-9.735 c-1.927-1.276-4.83-1.488-8.72,0.486c-3.564-1.751-6.698-0.345-8.398,1.906c-1.422,1.88-1.845,4.35-0.688,6.064 c-3.513,5.018-2.529,9.041,0.119,10.996C43.33,209.968,44.88,210.428,46.507,210.36z M54.386,194.068 c0.33,0.058,0.854,0.14,1.255,0.346c0.017,0.011,0.032,0.009,0.048,0.02c2.219,0.97,2.842,2.436,3.06,3.672 c2.094-6.009-6.379-6.214-6.379-6.214c0.71-2.55,4.192-2.225,6.846-0.086c1.883,1.521,2.81,5.448,0.1,7.624 c1.896,4.214-2.508,6.801-4.435,5.859c3.315-2.084,4.59-5.462-0.364-9.745l-0.008-0.006c-3.718-0.067-6.976,2.082-5.383,5.461 c0.783,1.637,2.891,2.567,4.451,1.383c1.249-0.955,1.397-3.127-0.305-3.701c0.585,1.125-0.279,2.501-1.544,2.468 c-1.054-0.031-2.07-1.262-1.527-2.305c-0.003-0.015,0.004-0.022,0.01-0.031c0.056-0.133,0.141-0.271,0.236-0.39 c2.041-2.951,6.225-0.109,5.409,2.981c-0.868,3.254-5.001,3.713-7.128,1.469c-2.309-2.446-1.381-6.263,1.32-7.983 C51.324,194.076,52.894,193.777,54.386,194.068z M44.194,201.072c-1.733-2.153-3.087-9.139,5.414-9.21 c-4.561,3.35-4.672,7.343-4.638,9.098c0.691,4.172,4.312,7.077,7.987,4.9c-1.287,4.048-6.637,3.624-7.573,2.969 C44.178,207.983,42.771,204.651,44.194,201.072z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
                        'stroke-width': '0',
                        'stroke-opacity': '1'
                    })
                    .data('id', this.name);
                }
            },
            top34Flower3: {
                name: 'top34Flower3',
                color: '#E9AFAF',
                path: 'M88.83,172.425c-0.624-2.017-1.38-3.662-2.23-4.984c-5.158-8.025-13.762-4.178-17.071,0.566 c-3.784-4.03-8.181-4.061-11.695-2.3c-4.4,2.202-7.414,7.21-6.101,10.69c-6.185,3.045-10.008,11.959-6.681,18.626 c2.064,4.137,6.88,7.408,15.59,7.878c4.423,6.597,11.256,7.294,16.454,5.096c4.341-1.835,7.543-5.688,7.252-9.815 c11.104-5.178,13.425-13.131,10.789-19.164C93.938,176.278,91.716,173.933,88.83,172.425z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
                        'stroke-width': '0',
                        'stroke-opacity': '1'
                    })
                    .data('id', this.name);
                }
            },
            top35Flower4: {
                name: 'top35Flower4',
                color: '#FCE5E6',
                path: 'M58.014,190.889c-0.513-0.432-1.34-1.097-1.826-1.854c-0.017-0.037-0.046-0.047-0.063-0.084 c-2.873-3.896-2.484-7.059-1.627-9.416c-9.636,8.314,4.836,17.14,4.836,17.14c-3.781,3.708-9.488-0.341-11.942-6.698 c-1.741-4.516,0.581-12.244,7.449-13.304c0.93-9.194,11.144-9.271,13.54-5.715c-7.826,0.295-13.41,4.873-9.113,17.244l0.008,0.019 c6.373,3.835,14.163,3.37,14.784-4.076c0.281-3.62-2.438-7.338-6.325-6.847c-3.119,0.404-5.549,4.02-3.174,6.715 c0.113-2.536,2.984-4.054,5.143-2.733c1.792,1.108,2.323,4.26,0.339,5.521c-0.009,0.026-0.027,0.035-0.046,0.044 c-0.232,0.175-0.516,0.33-0.8,0.439c-6.487,3.069-10.89-6.037-6.387-10.574c4.755-4.767,12.372-1.431,13.812,4.584 c1.556,6.543-3.87,12.227-10.271,12.506C63.326,193.935,60.309,192.883,58.014,190.889z M82.673,188.949 c0.848,5.463-3.794,18.914-18.591,10.539c11.251-1.244,15.437-8.049,17.135-11.121c2.972-7.917-0.393-16.569-8.937-16.476 c6.277-5.724,15.12,0.358,16.087,2.432C89.614,176.996,88.716,184.173,82.673,188.949z M87.956,170.549 c-0.625-2.017-1.383-3.661-2.231-4.984c-5.159-8.023-13.763-4.178-17.071,0.566c-3.784-4.03-8.183-4.059-11.695-2.3 c-4.4,2.203-7.414,7.211-6.102,10.692c-6.184,3.045-10.006,11.959-6.679,18.627c2.062,4.137,6.878,7.409,15.589,7.877 c4.424,6.597,11.256,7.295,16.455,5.097c4.34-1.836,7.542-5.689,7.252-9.815c11.103-5.178,13.424-13.131,10.789-19.165 C93.063,174.402,90.842,172.058,87.956,170.549z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
                        'stroke-width': '0',
                        'stroke-opacity': '1'
                    })
                    .data('id', this.name);
                }
            },
            shape36: {
                name: 'shape36',
                color: '#ffffff',
                path: 'M66.384,49.885c-33.021,0.44-39.297,27.441-39.297,54.79 c0.192,22.427-20.81,34.056-20.81,55.662c0,0-2.566,23.821,0,35.086c5.212,22.879,13.528,51.22,25.876,68.961 c-7.27,3.925-11.574,8.787-11.574,13.361c0,9.898,20.111,17.256,46.923,17.256s46.922-7.357,46.922-17.256 c0-4.822-4.775-9.975-12.776-14c12.822-17.626,22.274-45.285,26.994-68.322c2.332-11.375-2.152-35.086-2.152-35.086 c-1.693-27.546-20.877-35.705-20.808-55.662C105.681,77.326,99.399,49.445,66.384,49.885L66.384,49.885z',
                make: function(dollpath) {
                    dollpath.attr({
                        'id': this.name,
                        'stroke-width': '0',
                        'stroke-opacity': '1',
                        'opacity': '0'
                    })
                    .data('id', this.name);
                }
            }
        };
        this.customAnimation = {
            kiss: []
        };
        this.animationPaths = {
            kiss: [
                {
                    reference: 'top28Lips',
                    path: 'M55.327,116.719 c6.587,1.392,4.155,5.395,11.092,5.45c7.099-0.073,4.505-4.059,11.092-5.45c-9.587-0.936-5.88-3.776-10.828-2.199 C61.194,112.972,64.914,116.492,55.327,116.719z'
                },
                {
                    reference: 'top25LeftEye',
                    path: 'M51.939,99.585c0-1.153,1.838-2.085,4.104-2.085 s4.104,0.932,4.104,2.085c0,1.152-1.838,0.095-4.104,0.095S51.939,100.737,51.939,99.585z'
                },
                {
                    reference: 'top26RightEye',
                    path: 'M80.232,99.585c0-1.153-1.839-2.085-4.104-2.085 c-2.266,0-4.104,0.932-4.104,2.085c0,1.152,1.839,0.095,4.104,0.095C78.393,99.68,80.232,100.737,80.232,99.585z'
                }
            ]
        };
        this.pathOrder = [
            'bottom1Base',
            'bottom2Inner1',
            'bottom3Inner2',
            'bottom4Body',
            'bottom5LeftHand',
            'bottom6RightHand',
            'bottom7LeftArm',
            'bottom8RightArm',
            'bottom9Leaf1',
            'bottom10Leaf2',
            'bottom11Leaf3',
            'top12Base',
            'top13Head',
            'top14Bow',
            'top15LeftArm',
            'top16RightArm',
            'top17Face',
            'top18LeftCheek',
            'top19RightCheek',
            'top20LeftEyebrow',
            'top21RightEyebrow',
            'top22Hair',
            'top23LeftEyelash',
            'top24RightEyelash',
            'top25LeftEye',
            'top26RightEye',
            'top27Nose',
            'top28Lips',
            'top29Leaf1',
            'top30Leaf2',
            'top31Leaf3',
            'top32Flower1',
            'top33Flower2',
            'top34Flower3',
            'top35Flower4',
            'shape36'
        ];
    }
]);