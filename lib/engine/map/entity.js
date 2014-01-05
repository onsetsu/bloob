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
		initialize: function(name, settings) {
			this.name = name;
			this.zIndex = 0;
			this.stateAnimations = {};
			
			this.pos = Vector2.Zero.copy();
			this.offset = Vector2.Zero.copy();
			
			// Process/copy given settings.
			this.settings = {};
			settings = settings || {};
			for( var s in settings ) {
				if(!settings.hasOwnProperty(s)) continue;

				this.settings[s] = settings[s];
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
			// as getter
			if(typeof name === "undefined") return this.__state__;
			
			// as setter
			if(typeof name === "string") {
				this.__state__ = name;
			} else if(typeof name === "function") {
				this.__state__ = name(this);
			} else {
				throw "incompatible state data type";
			};

			if(this.hasAnimationForState(name)) this.setAnimationForState(name);
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
		
		// body.aabb AnimationSheet for StateAnimation
		addStateAnimation: function(name, sheet, frameTime, order) {
			this.stateAnimations[name] = new Animation(sheet, frameTime, order);
			
			// Use newly created Animation if set for current state.
			if(name == this.getState())
				this.setAnimationForState(name);
		},
		
		hasAnimationForState: function(name) {
			return typeof this.stateAnimations[name] !== "undefined";
		},
		
		getAnimationForState: function(name) {
			if(!this.hasAnimationForState(name)) throw "Entity has no StateAnimation for state \"" + name + "\".";
			return this.stateAnimations[name];
		},
		
		setAnimationForState: function(name) {
			this.setAnimation(this.getAnimationForState(name));
		},
		
		setAnimation: function(animation) {
			this.animation = animation;
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

		// Checks, whether a point given in world coordinates is contained in the Body.
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
			return this.isHovered();
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
		
		// draw in order:
		// 1. AnimationSheet on bodies bounding box
		// 2. Texture
		// 3. drawCallbacks
		draw: function(renderer) {
			if(typeof this.animation !== "undefined")
				this.animation.draw(this.getBody().getAABB());
			if(typeof this.getTexture() !== "undefined")
				this.drawTexture(renderer);
			this.applyDrawCallbacks(renderer);
		},
		
		debugDraw: function(debugDraw) {
		}
		
	});

	Entity.prototype.toJson = function() {
		var json = {
			name: this.name,
			zIndex: this.zIndex,
			state: this.getState(),
			tags: this.tags
		};
		
		json.stateAnimations = {};
		for(var state in this.stateAnimations)
			json.stateAnimations[state] = this.stateAnimations[state].toJson();

		return json;
	};
	
	Entity.fromJson = function(json) {
		
	};
	
	EntityRepository.addClass("Entity", Entity);
	
	return Entity;
});
