mini.Module(
	"engine/map/entity"
)
.requires(
	"engine/map/entityrepository",
	"engine/rendering/animation",
	"engine/rendering/texture",
	"behaviour/trait",
	"basic/mouse"
)
.defines(function(
	EntityRepository,
	Animation,
	Texture,
	Trait,
	Mouse
) {
	var Entity = mini.Class.subclass({
		initialize: function(name, x, y, settings) {
			this.name = name;
			this.zIndex = 0;
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
			this.tags = [];
			
			// Draw callbacks
			this.drawCallbacks = [];
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
		 * Tags
		 */
		addTag: function(tag) {
			// check for already existing.
			var exists = false;
			for(var i = 0; i < this.tags.length; i++)
				if(this.tags[i] == tag) {
					exists = true;
					break;
				};
			
			// do not add an already existing tag
			if (!exists) {
				this.tags.push(tag);
			}
		},

		removeTag: function(tag) {
			var index = this.tags.indexOf(tag);
			if (index !== - 1) {
				this.tags.splice( index, 1 );
			}
		},
		
		hasTag: function(tag) {
			return this.tags.indexOf(tag) !== -1;
		},

		getTags: function() {
			return this.tags;
		},

		/*
		 * Rendering/Animation
		 */
		
		// aabb AnimationSheet
		addStateAnimation: function(name, sheet, frameTime, order) {
			this.stateAnimations[name] = new Animation(sheet, frameTime, order);
		},
		
		// Texturing
		setTexture: function(texture) {
			this.texture = texture;
		},

		getTexture: function() {
			return this.texture;
		},

		drawTexture: function(renderer) {
			this.getTexture().drawOn(this.getBody(), renderer);
		},
		
		// DrawCallbacks
		addDrawCallback: function(callback) {
			this.drawCallbacks.push(callback);
		},
		
		clearDrawCallbacks: function() {
			this.drawCallbacks.length = 0;
		},
		
		applyDrawCallbacks: function(renderer) {
			for(var drawCallbackIndex in this.drawCallbacks) {
				this.drawCallbacks[drawCallbackIndex].call(this, renderer);
			}
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
			// does not contains any point without a body
			var body = this.getBody();
			if(typeof body === "undefined") return false;
			// check first for aabb
			if(!(body.getAABB().contains(point))) return false;
			return body.contains(point);
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

		isHovered: function() {
			var worldMouse = env.camera.screenToWorldCoordinates(env.input.mouse);
			return this.contains(worldMouse);
		},
		
		isClicked: function() {
			if(!env.input.state(Mouse.LeftButton)) return false;
			var worldMouse = env.camera.screenToWorldCoordinates(env.input.mouse);
			return this.contains(worldMouse);
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
		
		draw: function(renderer) {
			if(typeof this.getTexture() !== "undefined")
				this.drawTexture(renderer);
			this.applyDrawCallbacks(renderer);
		},
		
		debugDraw: function(debugDraw) {
			if(typeof this.animation !== "undefined")
				this.animation.draw(this.aabb);
		}
		
	});

	EntityRepository.addClass("Entity", Entity);
	
	return Entity;
});
