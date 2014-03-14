/* unframed_medias.js */
function unframed_media_ok(stream){
	window.attachMediaStream(signalsControl, stream)
	signalsControl.style.display = "block";
	self.localStream = stream; // TODO ...
}
function unframed_media (options) {
	var app = this;
	function ok (stream) {
		app.emit('User Media Stream Ok', stream);
	}
	function error (stream) {
		app.emit('User Media Stream Error', error);
	}
	if (navigator.mozGetUserMedia) {
		return navigator.mozGetUserMedia(options, ok, error);
	} else if (navigator.webkitGetUserMedia) {
		return navigator.webkitGetUserMedia(oprions, ok, error);
	} else {
		throw "User Media API not available";
	}
}
window.unframed.extend({
	media: unframed_media
});