mini.Module(
	"behaviour/trait"
)
.requires(
	"assets/resource"
)
.defines(function() {
	var Trait = mini.Class.subclass({
		initialize: function(callback) {
			this.onUpdate(callback);
		},
		
		// react to update
		__callback: function() {},
		onUpdate: function(callback) {
			this.__callback = callback;
			
			return this;
		},
		update: function(entity) {
			this.__callback.apply(this, arguments);
		},
		
		// react to mousedown
		__mouseDownCallback: function() {},
		onMouseDown: function(callback) {
			this.__mouseDownCallback = callback;
			
			return this;
		},
		mouseDown: function() {
			this.__mouseDownCallback.apply(this, arguments);
		}
	});
	
	return Trait;
});
