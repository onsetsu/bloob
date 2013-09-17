mini.Module(
		"basic/audio/music"
)
.requires(
		"basic/audio/sound"
)
.defines(function() {
	var Track = function(audio, path) {
		this._audio = audio;
		this._bufferPath = path;
		this._volume = 1.0;
		this.load(path);
	};

	Track.prototype.load = function(path) {
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
		    }, Scarlet.log);
		};
		request.send();
	};

	Track.prototype.play = function() {
		// creates a sound source
		var sourceNode = this._audio.context.createBufferSource(); 
		// tell the sourceNode which sound to play
		sourceNode.buffer = this._audio.buffers[this._bufferPath];

		sourceNode.loop = true;
		sourceNode.loopStart = 1.0;
		sourceNode.loopEnd = 30.0;
		
		// Declare gain node
		var gainNode = this._audio.context.createGainNode();
		this.volumeNode = gainNode;
		this._volume = gainNode.gain.value;
		
		// connect the sourceNode to the positionNode to the context's destination (the speakers)
		sourceNode.connect(gainNode);
		gainNode.connect(this._audio.trackParent);

		// play the source now
		sourceNode.start(this._audio.context.currentTime + 5);

	    return {volume: gainNode, source: sourceNode};
	};

	// TODO: fade-in and fade out
	// TODO: implement the following
	Track.prototype.pause = function() {};
	Track.prototype.stop = function() {};

	Track.prototype.setVolume = function(volume) {
		this.volumeNode.gain.value = volume;
		this._volume = volume;
	};

	Track.prototype.getVolume = function() {
		return this.volumeNode.gain.value;
	};

	// TODO: add stack of tracks
	var MusicPlayer = function() {
		
	};

	Bloob.Track = Track;
	
	return Track;
});
