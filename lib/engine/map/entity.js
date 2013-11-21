mini.Module(
	"engine/map/entity"
)
.requires(
	"engine/map/entityrepository",
	"engine/rendering/animation",
	"engine/time/tween",
	"behaviour/trait"
)
.defines(function(
	EntityRepository,
	Animation,
	Tween,
	Trait
) {
	var Entity = mini.Class.subclass({
		initialize: function(x, y, settings) {
			this.stateAnimations = {};
			
			this.aabb = new Jello.AABB(
				new Jello.Vector2(x, y),
				new Jello.Vector2(x + 4, y + 4)
			);
			
			this.pos = Vector2.Zero.copy();
			this.offset = Vector2.Zero.copy();
			
			// Process settings.
			settings = settings || {};
			for( var s in settings ) {
				this[s] = settings[s];
			}
		},
		state: function(name) {
			if(typeof name === "undefined") return this.__state__;
			if(typeof name === "string") {
				this.__state__ = name;
			} else if(typeof name === "function") {
				this.__state__ = name(this);
			} else {
				throw "incompatible state data type";
			};
			
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
		},
		
		// Utilities.
		contains: function(point) {
			return this.aabb.contains(point);
		}
		
	});

	EntityRepository.addClass("Entity", Entity);
	
	return Entity;
});
