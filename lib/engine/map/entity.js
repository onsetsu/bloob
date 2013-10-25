mini.Module(
	"engine/map/entity"
)
.requires(
	"engine/rendering/animationsheet",
	"engine/rendering/animation",
	"engine/time/tween"
)
.defines(function(
	AnimationSheet,
	Animation,
	Tween
) {
	var Entity = mini.Class.subclass({
		animationSheet: new AnimationSheet("sample.png", 96, 128),
		initialize: function() {
			this.animation = new Animation(this.animationSheet, 0.2, [0,1,2,3,2,1]);
			this.aabb = new Jello.AABB(
				new Jello.Vector2(-10, -10),
				new Jello.Vector2( 10,  10)
			);
			this.tween = new Tween(this.aabb.Min)
				.to({"x": 5, "y": -5}, 2.5, Tween.Ease.linear())
				.wait(1.0)
				.to({"y": -55}, 5.5, Tween.Ease.linear())
				.onFinished(function() { console.log(1234567890); })
				.start();
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
