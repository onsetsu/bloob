Bloob.Loop = function() {
	this.loop = new Scarlet.Loop();
};

Bloob.Loop.prototype.start = function(fn) {
	this.__loopId__ = this.loop.start(fn);
};

Bloob.Loop.prototype.stop = function() {
	this.loop.stop(this.__loopId__);
};

Bloob.Loop.prototype.add = function(context, func) {
	
};
