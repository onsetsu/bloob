mini.Module(
	"engine/map/entity"
)
.requires(
	"engine/map/entityrepository",
	"engine/rendering/animationsheet",
	"engine/rendering/animation",
	"engine/time/tween"
)
.defines(function(
	EntityRepository,
	AnimationSheet,
	Animation,
	Tween
) {
	var Entity = mini.Class.subclass({
		initialize: function() {
			this.stateAnimations = {};
			this.aabb = new Jello.AABB(
				Jello.Vector2.Zero.copy(),
				Jello.Vector2.One.copy()
			);
		},
		state: function(name) {
			if(typeof this.stateAnimations[name] !== "undefined")
				this.animation = this.stateAnimations[name];
		},
		addStateAnimation: function(name, sheet, frameTime, order) {
			this.stateAnimations[name] = new Animation(sheet, frameTime, order);
		},
		
		// Updating.
		update: function(timePassed) {
			if(typeof this.animation !== "undefined")
				this.animation.update(timePassed);
		},
		draw: function() {
			
		},
		debugDraw: function(debugDraw) {
			if(typeof this.animation !== "undefined")
				this.animation.draw(this.aabb);
		}
	});

	EntityRepository.classes["Entity"] = Entity;
	
	return Entity;
});
