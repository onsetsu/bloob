Bloob.Loop = function() {
	this.loop = new Scarlet.Loop();
	this.callbacks = [];
};

Bloob.Loop.prototype.start = function(fn) {
	var fn = Bloob.Utils.bind(this.update, this);
	this.__loopId__ = this.loop.start(fn);
	return this;
};

Bloob.Loop.prototype.stop = function() {
	this.loop.stop(this.__loopId__);
	return this;
};

Bloob.Loop.prototype.update = function(timePassed) {
	timePassed = 1/60;
	for(var index in this.callbacks)
		this.callbacks[index](timePassed);
};

Bloob.Loop.prototype.add = function(context, func) {
	this.callbacks.push(Bloob.Utils.bind(func, context));
	return this;
};

Bloob.Loop.prototype.remove = function(blub) {
	// TODO: implement this
	return this;
};

Bloob.Loop.prototype.clear = function() {
	this.callbacks.length = 0;
	return this;
};
