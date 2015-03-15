'use strict';
angular.module('personalApp.audiocontext', [])

.factory('AppfactBufferLoader', [
    function() {
        
        function BufferLoader(context, urlList, callback) {
            this.context = context;
            this.urlList = urlList;
            this.onload = callback;
            this.bufferList = [];
            this.loadCount = 0;
        }

        BufferLoader.prototype.loadBuffer = function(url, index) {
            // Load buffer asynchronously
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';

            var loader = this;

            request.onload = function() {
                // Asynchronously decode the audio file data in request.response
                loader.context.decodeAudioData(
                    request.response,
                    function(buffer) {
                        if (!buffer) {
                            console.log('error decoding file data: ' + url);
                            return;
                        }
                        loader.bufferList[index] = buffer;
                        if (++loader.loadCount === loader.urlList.length) {
                            loader.onload(loader.bufferList);
                        }
                    },
                    function(error) {
                        console.error('decodeAudioData error', error);
                    }
                );
            };

            request.onerror = function() {
                console.error('BufferLoader: XHR error');
            };

            request.send();
        };

        BufferLoader.prototype.load = function() {
            for (var i = 0; i < this.urlList.length; ++i) {
                this.loadBuffer(this.urlList[i], i);
            }
        };
        
        return BufferLoader;
    }
])

.service('AppservAudio',[
    'appSettings',
    'AppfactBufferLoader',
    function(appSettings, AppfactBufferLoader) {
        var audioContextSupported = false;
        var context = null;
        var appSounds = appSettings.contentSounds;
        var appSoundsBuffer;
        var appSoundsBufferList = [];
        var soundsAvailable = false;
        
        this.playSound = function(soundIndex, time) {
            if(soundsAvailable) {
                var source = context.createBufferSource();
                source.buffer = appSoundsBufferList[soundIndex];
                source.connect(context.destination);
                source.start(time);
            }
        };

        this.preloadSounds = function(soundsUrlCollection) {
            //console.log('Preloading app sounds', appSounds);
            var soundsLoadedHandler = function(soundsList) {
                appSoundsBufferList = appSoundsBufferList.concat(soundsList);
                soundsAvailable = true;
            };
            appSoundsBuffer = new AppfactBufferLoader(context, soundsUrlCollection, soundsLoadedHandler);
            appSoundsBuffer.load();
        };

        this.init = function() {
            try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                context = new AudioContext();
                audioContextSupported = true;
                this.preloadSounds(appSounds);
            } catch(e) {
                console.log('NO AUDIO CONTEXT SUPPORT');
            }
        };
    }
]);