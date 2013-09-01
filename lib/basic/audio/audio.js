Bloob.Audio = function() {};

Bloob.Audio.context = (function init() {
	try {
		// Fix up for prefixing
		window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"];
		return new window["AudioContext"]();
	}
	catch(e) {
		alert('Web Audio API is not supported in this browser');
		return undefined;
	}
})();

Bloob.Audio.buffers = {};

Scarlet.log("hallo audio", Bloob.Audio.context);
