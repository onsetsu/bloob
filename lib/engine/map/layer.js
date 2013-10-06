mini.Module(
	"engine/map/layer"
)
.requires(

)
.defines(function() {
	var Layer = mini.Class.subclass({
		initialize: function() {
			
		},
		update: function(timePassed) {
			
		},
		draw: function() {
			
		},
		debugDraw: function(debugDraw) {
			
		}
	});
	
	Layer.WorldLayer = Layer.subclass({
		setWorld: function(world) {
			this.world = world;
			
			return this;
		},
		update: function(timePassed) {
			Layer.prototype.update.apply(timePassed);
			
			if(typeof this.world !== "undefined")
				this.world.update(timePassed);
		},
		draw: function() {
			Layer.prototype.draw.apply();
			
		},
		debugDraw: function(debugDraw) {
			Layer.prototype.debugDraw.apply(debugDraw);
			
			if(typeof this.world !== "undefined")
				this.world.debugDraw(debugDraw);
		}
	});
	
	return Layer;
});
