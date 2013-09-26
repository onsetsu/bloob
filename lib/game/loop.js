mini.Module(
	"game/loop"
)
.requires(
	"engine/scarletloop"
)
.defines(function(ScarletLoop) {
	var Loop = function() {
		this.loop = new ScarletLoop();
		this.callbacks = [];
		this.removals = {};
	};

	Loop.prototype.start = function(fn) {
		var fn = Bloob.Utils.bind(this.update, this);
		this.__loopId__ = this.loop.start(fn);
		return this;
	};

	Loop.prototype.stop = function() {
		this.loop.stop(this.__loopId__);
		return this;
	};

	Loop.prototype.update = function(timePassed) {
		timePassed = 1/60;
		for(var index in this.callbacks)
			this.callbacks[index](timePassed);
	};

	Loop.prototype.add = function(context, func, keyForRemoval) {
		var bindFunction = Bloob.Utils.bind(func, context);
		
		if(typeof keyForRemoval !== "undefined") {
			this.removals[keyForRemoval] = bindFunction;
		}
		this.callbacks.push(bindFunction);
		return this;
	};

	Loop.prototype.remove = function(keyForRemoval) {
		var functionToRemove = this.removals[keyForRemoval];
		var index = this.callbacks.indexOf(functionToRemove);
		if (index !== - 1) {
			this.callbacks.splice( index, 1 );
		}
		return this;
	};

	Loop.prototype.clear = function() {
		this.callbacks.length = 0;
		return this;
	};

	Bloob.Loop = Loop;
	
	return Loop;
});
