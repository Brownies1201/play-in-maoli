angular.module('ui.bootstrap.demo', ['ui.bootstrap']);
angular.module('ui.bootstrap.demo').controller('CarouselDemoCtrl', function ($scope) {
  // Put event listeners into place
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		video = document.getElementById("video"),
		videoObj = { "video": true },
		errBack = function(error) {
			console.log("Video capture error: ", error.code); 
		};

window.addEventListener("DOMContentLoaded", function() {
	// Grab elements, create settings, etc.

	// Put video listeners into place
	if(navigator.getUserMedia) { // Standard
		navigator.getUserMedia(videoObj, function(stream) {
			 localStream = stream;
			video.src = stream;
			video.play();
		}, errBack);
	} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
		navigator.webkitGetUserMedia(videoObj, function(stream){
			 localStream = stream;
			video.src = window.webkitURL.createObjectURL(stream);
			video.play();
		}, errBack);
	}
	else if(navigator.mozGetUserMedia) { // Firefox-prefixed
		navigator.mozGetUserMedia(videoObj, function(stream){
			 localStream = stream;
			video.src = window.URL.createObjectURL(stream);
			video.play();
		}, errBack);
	}
}, false);
// Trigger photo take
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

document.getElementById("snap").addEventListener("click", function() {
	ctx.drawImage(video, 0, 0, 640, 480);
	    localStream.stop();
});
});