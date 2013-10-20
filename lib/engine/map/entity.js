mini.Module(
	"engine/map/entity"
)
.requires(
	"engine/rendering/animationsheet",
	"engine/rendering/animation"
)
.defines(function(AnimationSheet, Animation) {
	var Entity = mini.Class.subclass({
		animationSheet: new AnimationSheet("filePath", 252, 279),
		initialize: function() {
			this.animation = new Animation(this.animationSheet, 0.2, [0,0,0,0]);
		},
		update: function() {
			console.log("update");
		},
		draw: function() {
			console.log("draw");
		},
		debugDraw: function(debugDraw) {
			console.log("debugDraw");
		}
	});

	return Entity;
});
