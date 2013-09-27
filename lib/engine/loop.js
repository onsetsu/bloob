mini.Module(
	"engine/loop"
)
.requires(

)
.defines(function() {
	var _Loop = function(callback, desiredTime) {
		var that = this;
		// -----------------------------------------------------------------------------

		// use requestAnimationFrame if available or setInterval otherwise

		// Find vendor prefix, if any
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for( var i = 0; i < vendors.length && !window.requestAnimationFrame; i++ ) {
			window.requestAnimationFrame = window[vendors[i]+'RequestAnimationFrame'];
		}

		// Use requestAnimationFrame if available
		if( window.requestAnimationFrame ) {
			var next = 1,
				anims = {},
				lastFrame = {};

			that.start = function( callback, element ) {
				var current = next++;
				anims[current] = true;
				lastFrame[current] = new Date().getTime();

				var animate = function() {
					if( !anims[current] ) { return; } // deleted?
					window.requestAnimationFrame( animate, element );
					
					// setup time since last call
					var tm = new Date().getTime();
					var dt = (tm - lastFrame[current]) / 1000;
					lastFrame[current] = tm;

					callback(dt);
				};
				window.requestAnimationFrame( animate, element );
				return current;
			};

			that.stop = function( id ) {
				delete anims[id];
			};
		}

		// [set/clear]Interval fallback
		else {
			that.start = function( callback, element ) {
				return window.setInterval( callback, 1000/60 );
			};
			that.stop = function( id ) {
				window.clearInterval( id );
			};
		}
	};
	
	var Loop = function() {
		this.loop = new _Loop();
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
