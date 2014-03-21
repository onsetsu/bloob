mini.Module(
	"jiquid/node"
)
.requires(
	"physics/jello"
)
.defines(function(Jello) {
	var Node = function() {
	    this.m = 0;
	    this.d = 0;
	    this.gx = 0;
	    this.gy = 0;
	    this.velocity = Jello.Vector2.Zero.copy();
	    this.acceleration = Jello.Vector2.Zero.copy();
	};
	
	return Node;
});
