mini.Module(
		"basic/audio/sound"
)
.requires(
		"basic/audio/audio"
)
.defines(function() {
	var Sound = function(audio, path) {
		this._audio = audio;
		this._bufferPath = path;
		this.load(path);
	};

	Sound.prototype.load = function(path) {
		var audio = this._audio;

		// return if file already loaded
		if(typeof audio.buffers[path] !== "undefined") return;
		
		var request = new XMLHttpRequest();
		request.open('GET', path, true);
		request.responseType = 'arraybuffer';
		
		// Decode asynchronously
		request.onload = function () {
			audio.context.decodeAudioData(request.response, function (buffer) {
		    	audio.buffers[path] = buffer;
		    }, console.log);
		};
		request.send();
	};

	Sound.prototype.play = function() {
		// creates a sound source
		var sourceNode = this._audio.context.createBufferSource(); 
		// tell the sourceNode which sound to play
		sourceNode.buffer = this._audio.buffers[this._bufferPath];
		
	    var positionNode = this._audio.context.createPanner();
	    positionNode.setPosition(0, 0, 0);
		
		// connect the sourceNode to the positionNode to the context's destination (the speakers)
		sourceNode.connect(positionNode);
	    positionNode.connect(this._audio.soundParent);

		// play the source now
		sourceNode.start(0);

	    return {position: positionNode, source: sourceNode};
	};
	
	Bloob.Sound = Sound;
	
	return Sound;
});
