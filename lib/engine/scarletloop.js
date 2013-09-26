/**
 * Provide a generalized method to loop a given callback
 * after a desired time passed.
 * 
 */
mini.Module(
	"engine/scarletloop"
)
.requires(

)
.defines(function() {
	var ScarletLoop = function(callback, desiredTime) {
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
	
	return ScarletLoop;
});
