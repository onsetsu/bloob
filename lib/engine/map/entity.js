mini.Module(
	"engine/map/entity"
)
.requires(
	"engine/rendering/animationsheet",
	"engine/rendering/animation"
)
.defines(function(AnimationSheet, Animation) {
	var Entity = mini.Class.subclass({
		animationSheet: new AnimationSheet("sample.png", 252, 279),
		initialize: function() {
			this.animation = new Animation(this.animationSheet, 0.2, [0,0,0,0]);
			this.aabb = new Jello.AABB(
				new Jello.Vector2(-10, -10),
				new Jello.Vector2( 10,  10)
			);
		},
		update: function() {
			
		},
		draw: function() {
			
		},
		debugDraw: function(debugDraw) {
			this.aabb.debugDraw(debugDraw);

			debugDraw.setOptions({
				"color": "lightgreen",
				"opacity": 1.0,
				"lineWidth": 1
			});

			debugDraw.drawRectangle(this.aabb.Min, 10);
			
			this.animationSheet.image.draw();
		}
	});

	return Entity;
});
