mini.Module(
	"engine/map/entity"
)
.requires(
	"engine/rendering/animationsheet",
	"engine/rendering/animation"
)
.defines(function(AnimationSheet, Animation) {
	var Entity = mini.Class.subclass({
		animationSheet: new AnimationSheet("sample.png", 96, 128),
		initialize: function() {
			this.animation = new Animation(this.animationSheet, 0.2, [0,1,2,3,2,1]);
			this.aabb = new Jello.AABB(
				new Jello.Vector2(-10, -10),
				new Jello.Vector2( 10,  10)
			);
		},
		update: function(timePassed) {
			this.animation.update(timePassed);
		},
		draw: function() {
			
		},
		debugDraw: function(debugDraw) {
			this.animation.draw(this.aabb);
		}
	});

	return Entity;
});
