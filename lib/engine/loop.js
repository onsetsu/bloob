define(function() { 'use strict';
	class _Loop {
		constructor(callback, desiredTime) {
			var that = this;
			// -----------------------------------------------------------------------------

			// use requestAnimationFrame if available or setInterval otherwise

			// Find vendor prefix, if any
			var vendors = ['ms', 'moz', 'webkit', 'o'];
			for (var i = 0; i < vendors.length && !window.requestAnimationFrame; i++) {
				window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
			}

			// Use requestAnimationFrame if available
			if (window.requestAnimationFrame) {
				var next = 1,
					anims = {},
					lastFrame = {};

				that.start = function (callback, element) {
					var current = next++;
					anims[current] = true;
					lastFrame[current] = window.performance.now();

					var animate = function () {
						if (!anims[current]) {
							return;
						} // deleted?
						window.requestAnimationFrame(animate, element);

						// setup time since last call
						var tm = window.performance.now();
						var dt = (tm - lastFrame[current]) / 1000;
						lastFrame[current] = tm;

						callback(dt);
					};
					window.requestAnimationFrame(animate, element);
					return current;
				};

				that.stop = function (id) {
					delete anims[id];
				};
			}

			// [set/clear]Interval fallback
			else {
				that.start = function (callback, element) {
					return window.setInterval(callback, 1000 / 60);
				};
				that.stop = function (id) {
					window.clearInterval(id);
				};
			}
		}
	}
	
	class Loop {
		constructor() {
			this.loop = new _Loop();
			this.callbacks = new Map();
		}

		start() {
			var fn = this.update.bind(this);
			this.__loopId__ = this.loop.start(fn);

			return this;
		}
	
		stop() {
			this.loop.stop(this.__loopId__);

			return this;
		}
	
		update(timePassed) {
            this.callbacks.forEach(function(callback) {
                callback(timePassed);
            });
		}
	
		add(context, func, keyForRemoval) {
            keyForRemoval = keyForRemoval || {};
			var bindFunction = func.bind(context);
			
			this.callbacks.set(keyForRemoval, bindFunction);

			return this;
		}
	
		remove(keyForRemoval) {
			if(this.callbacks.has(keyForRemoval)) {
                this.callbacks.delete(keyForRemoval);
            }

			return this;
		}
	
		clear() {
			this.callbacks.clear();

			return this;
		}
	}

	return Loop;
});
