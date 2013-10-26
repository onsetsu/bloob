mini.Module(
	"bloob/entities/entitytest"
)
.requires(
	"engine/map/entityrepository",
	"engine/map/entity",
	"engine/rendering/animationsheet",
	"engine/rendering/animation",
	"engine/time/tween"
)
.defines(function(
	EntityRepository,
	Entity,
	AnimationSheet,
	Animation,
	Tween
) {
	var EntityTest = Entity.subclass({
		animationSheet: new AnimationSheet("sample.png", 96, 128),
		initialize: function() {
			Entity.prototype.initialize.apply(this, arguments);
			
			this.addStateAnimation("idle", this.animationSheet, 0.2, [0,1,2,3,2,1]);
			this.state("idle");
			
			this.aabb = new Jello.AABB(
				new Jello.Vector2(-10, -10),
				new Jello.Vector2( 10,  10)
			);
			
			this.tween = new Tween(this.aabb.Min)
				.to({"x": 5, "y": -5}, 2.5, Tween.Ease.linear())
				.wait(1.0)
				.to({"x": -10, "y": -55}, 5.5, Tween.Ease.linear())
				.onFinished(function() { console.log(1234567890); })
				.start();
		}
	});

	EntityRepository.addClass("EntityTest", EntityTest);
	
	return EntityTest;
});
