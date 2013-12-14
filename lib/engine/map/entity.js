mini.Module(
	"engine/map/entity"
)
.requires(
	"engine/map/entityrepository",
	"engine/rendering/animation",
	"engine/rendering/texture",
	"behaviour/trait"
)
.defines(function(
	EntityRepository,
	Animation,
	Texture,
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
				if(!settings.hasOwnProperty(s)) continue;

				this[s] = settings[s];
			}
			
			this.setState("idle");
		},
		
		addToLayer: function (layer) {
			layer.addEntity(this);
			
			return this;
		},

		/*
		 *  State
		 */
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

		setState: function(name) {
			this.state(name);
		},
		
		getState: function() {
			return this.state();
		},
		
		/*
		 * Rendering/Animation
		 */
		addStateAnimation: function(name, sheet, frameTime, order) {
			this.stateAnimations[name] = new Animation(sheet, frameTime, order);
		},
		
		setTexture: function(texture) {
			this.texture = texture;
		},

		getTexture: function() {
			return this.texture;
		},

		drawTexture: function() {
			this.getTexture().drawOn(this.getBody());
		},
		
		/*
		 * Physics
		 */
		setBody: function(body) {
			this.body = body;
		},

		getBody: function() {
			return this.body;
		},

		// TODO: replace with bodies aabb.
		// TODO: check for actual inclusion, not just aabb.
		contains: function(point) {
			return this.aabb.contains(point);
		},
		
		/*
		 * Behavior
		 */
		setTrait: function(trait) {
			this.trait = trait;
		},

		getTrait: function() {
			return this.trait;
		},

		/*
		 *  Updating
		 */
		update: function() {
			var trait = this.getTrait();
			if(typeof trait !== "undefined")
				trait.update(this);
			
			if(typeof this.animation !== "undefined")
				this.animation.update();
		},
		
		draw: function() {
			if(typeof this.getTexture() !== "undefined")
				this.drawTexture();
		},
		
		debugDraw: function(debugDraw) {
			if(typeof this.animation !== "undefined")
				this.animation.draw(this.aabb);
			this.draw();
		}
		
	});

	EntityRepository.addClass("Entity", Entity);
	
	return Entity;
});
