Bloob.Track = function(audio, path) {
	this._audio = audio;
	this._bufferPath = path;
	this._volume = 1.0;
	this.load(path);
};

Bloob.Track.prototype.load = function(path) {
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

Bloob.Track.prototype.play = function() {
	// creates a sound source
	var sourceNode = this._audio.context.createBufferSource(); 
	// tell the sourceNode which sound to play
	sourceNode.buffer = this._audio.buffers[this._bufferPath];
	
	// Declare gain node
	var gainNode = this._audio.context.createGainNode();
	this.volumeNode = gainNode;
	this._volume = gainNode.gain.value;
	
	// connect the sourceNode to the positionNode to the context's destination (the speakers)
	sourceNode.connect(gainNode);
	gainNode.connect(this._audio.trackParent);

	// play the source now
	sourceNode.start(0);

    return {volume: gainNode, source: sourceNode};
};

Bloob.Track.prototype.pause = function() {};
Bloob.Track.prototype.stop = function() {};

Bloob.Track.prototype.setVolume = function(volume) {
	this.volumeNode.gain.value = volume;
	this._volume = volume;
};

Bloob.Track.prototype.getVolume = function() {
	return this.volumeNode.gain.value;
};

Scarlet.log("hallo");

Bloob.MusicPlayer = function() {
	
};
