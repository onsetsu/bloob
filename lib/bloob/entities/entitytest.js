mini.Module(
	"bloob/entities/entitytest"
)
.requires(
	"engine/map/entityrepository",
	"engine/map/entity",
	"engine/rendering/animationsheet",
	"engine/rendering/animation"
)
.defines(function(
	EntityRepository,
	Entity,
	AnimationSheet,
	Animation
) {
	var EntityTest = Entity.subclass({
		animationSheet: new AnimationSheet("sample.png", 96, 128),
		initialize: function() {
			Entity.prototype.initialize.apply(this, arguments);
			
			this.addStateAnimation("idle", this.animationSheet, 0.2, [0,1,2,3,2,1]);
			this.state("idle");
		}
	});

	EntityRepository.addClass("EntityTest", EntityTest);
	
	return EntityTest;
});
