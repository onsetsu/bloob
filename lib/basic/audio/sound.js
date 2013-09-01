Bloob.Sound = function(path) {
	this._bufferPath = path;
	this.load(path);
};

Bloob.Sound.prototype.load = function(path) {
	var request = new XMLHttpRequest();
	request.open('GET', path, true);
	request.responseType = 'arraybuffer';
	
	// Decode asynchronously
	request.onload = function () {
	    Bloob.Audio.context.decodeAudioData(request.response, function (buffer) {
	    	Bloob.Audio.buffers[path] = buffer;
	    }, Scarlet.log);
	};
	request.send();
};

Bloob.Sound.prototype.play = function() {
	// creates a sound source
	var sourceNode = Bloob.Audio.context.createBufferSource(); 
	// tell the sourceNode which sound to play
	sourceNode.buffer = Bloob.Audio.buffers[this._bufferPath];
	sourceNode.connect(Bloob.Audio.context.destination);
	
    var positionNode = Bloob.Audio.context.createPanner();
    positionNode.setPosition(0, 0, 0);
	
	// connect the sourceNode to the positionNode to the context's destination (the speakers)
	sourceNode.connect(positionNode);
    positionNode.connect(Bloob.Audio.context.destination);

	// play the source now
	sourceNode.start(0);

    return {position: positionNode, source: sourceNode};
};
