define(function(require) { 'use strict';
	/* jshint esnext: true */

    var Animation = require('./../rendering/animation'),
		Texture = require('engine/rendering/texture'),
		DrawCallback = require('engine/rendering/drawcallback'),
		SmartTexture = require('engine/rendering/texture/smarttexture'),
		Trait = require('behaviour/trait'),
		Jello = require('physics/jello'),
		Body = Jello.Body,
		Component = require('./component');

	// TODO: extract into own file
	// TODO: add corresponding system
	// TODO: make it serializable (save only the path to the callback implementation file and act accordingly)
	class DrawCallbackComponent extends Component {}

	var Entity = mini.Class.subclass({
		initialize: function(name) {
			this.name = name;
			this.zIndex = 0;
			this.stateAnimations = {};
			
			this.setState('idle');
			this.tags = [];

			this.components = new Map();
		},
		
		addToLayer: function(layer) {
			layer.addEntity(this);
			
			return this;
		},

		/*
		 *  zIndex
		 */
		setZIndex: function(zIndex) {
			this.zIndex = zIndex;
		},

		getZIndex: function() {
			return this.zIndex;
		},

		/*
		 *  components
		 */
		addComponent: function(component) {
			var componentClass = component.__proto__.constructor;

			if(this.components.has(componentClass)) {
				this.components.get(componentClass).push(component);
			} else {
				this.components.set(componentClass, [component]);
			}
		},

		removeComponent: function(component) {
			var componentClass = component.__proto__.constructor;

			if(this.components.has(componentClass)) {
				var components = this.components.get(componentClass);
				var index = components.indexOf(component);
				if(index !== -1) {
					components.splice(index, 1);
					return true;
				}
			}
			throw new Error('component not found', component, 'of', componentClass);
			return false;
		},

		hasComponent: function(componentClass) {
			return !!this.getComponent(componentClass);
		},

		getComponent: function(componentClass) {
			return this.getComponents(componentClass)[0];
		},

		getComponents: function(componentClass) {
			return this.components.get(componentClass) || [];
		},

		clearComponents: function(componentClass) {
			if(this.components.has(componentClass)) {
				this.components.delete(componentClass);
			}
		},

		/*
		 *  State
		 */
		setState: function(name) {
			if(typeof name === 'string') {
				this.__state__ = name;
			} else if(typeof name === 'function') {
				this.__state__ = name(this);
			} else {
				throw 'incompatible state data type';
			}

			if(this.hasAnimationForState(name)) {
				this.setAnimationForState(name);
			}
		},
		
		getState: function() {
			return this.__state__;
		},
		
		/*
		 * Tags
		 */
        // TODO: use a Set for tags
		addTag: function(tag) {
			// check for already existing.
			var exists = false;
			for(var i = 0; i < this.tags.length; i++) {
				if(this.tags[i] == tag) {
					exists = true;
					break;
				}
			}

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
		addStateAnimation: function(name, sheetOrAnimation, frameTime, order) {
			if(sheetOrAnimation instanceof Animation) {
				this.stateAnimations[name] = sheetOrAnimation;
			} else {
				this.stateAnimations[name] = new Animation(sheetOrAnimation, frameTime, order);
			}
			
			// Use newly created Animation if set for current state.
			if(name == this.getState()) {
				this.setAnimationForState(name);
			}
		},
		
		hasAnimationForState: function(name) {
			return typeof this.stateAnimations[name] !== 'undefined';
		},
		
		getAnimationForState: function(name) {
			if(!this.hasAnimationForState(name)) {
				throw 'Entity has no StateAnimation for state "' + name + '".';
			}
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
			var componentToAdd = new DrawCallbackComponent();
			componentToAdd.drawCallback = callback;

			this.addComponent(componentToAdd);
		},
		
		clearDrawCallbacks: function() {
			this.clearComponents(DrawCallbackComponent);
		},
		
		applyDrawCallbacks: function(renderer) {
			this.getComponents(DrawCallbackComponent).forEach(function(component) {
				component.drawCallback.draw(this, renderer);
			}, this);
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
			if(typeof body === 'undefined') {
				return false;
			}
			// check first for aabb
			if(!(body.getAABB().contains(point))) {
				return false;
			}
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
			if(!env.input.state(env.game.LeftButton)) {
				return false;
			}
			return this.isHovered();
		},
		
		/*
		 *  Updating
		 */
		update: function() {
			var trait = this.getTrait();
			if(typeof trait !== 'undefined') {
				trait.update(this);
			}

			if(typeof this.animation !== 'undefined') {
				this.animation.update();
			}
		},
		
		// draw in order:
		// 1. AnimationSheet on bodies bounding box
		// 2. Texture
		// 3. drawCallbacks
		// 4. smart texture
		draw: function(renderer, layer) {
			if(typeof this.animation !== 'undefined') {
				this.animation.draw(this.getBody().getAABB());
			}
			if(typeof this.getTexture() !== 'undefined') {
				this.drawTexture(renderer);
			}
			this.applyDrawCallbacks(renderer);
			if(this.smartTexture) {
				this.smartTexture.draw(this, renderer, layer);
			}
		},
		
		debugDraw: function(debugDraw) {
			this.debugDrawName(debugDraw);
		},
		
		debugDrawName: function(debugDraw) {
			var body = this.getBody();
			if(body && body.isVisible(debugDraw)) {
				debugDraw.drawTextWorld(
					this.name,
					body.getAABB().getBottomLeft(),
					'lightgreen',
					0.8,
					'bottom'
				);
			}
		}
		
	});

	Entity.prototype.toJson = function() {
		var json = {
			name: this.name,
			zIndex: this.getZIndex(),
			state: this.getState(),
			tags: this.getTags()
		};
		
		// Rendering
		json.stateAnimations = {};
		for(var state in this.stateAnimations) {
			// TODO: refactor this line
			json.stateAnimations[state] = this.stateAnimations[state].toJson();
		}

		if(typeof this.getTexture() !== 'undefined') {
			json.texture = this.getTexture().toJson();
		}

		json.drawCallbacks = [];
		this.getComponents(DrawCallback).forEach(function(drawCallback) {
			json.drawCallbacks.push(drawCallback.toJson());
		});

		// Physics
		if(typeof this.getBody() !== 'undefined') {
			json.body = this.getBody().toJson();
		}

		// Behavior
		if(typeof this.getTrait() !== 'undefined') {
			json.trait = this.getTrait().toJson();
		}

		return json;
	};

	Entity.fromJson = function(json, world) {
	    var index;
		var entity = new Entity(json.name);
		entity.setZIndex(json.zIndex);
		entity.setState(json.state);
		for(index in json.tags) {
			entity.addTag(json.tags[index]);
		}
		
		// Rendering
		for(var state in json.stateAnimations) {
			entity.addStateAnimation(state, Animation.fromJson(json.stateAnimations[state]));
		}
		
		if(typeof json.texture !== 'undefined') {
			entity.setTexture(Texture.fromJson(json.texture));
		}

		if(typeof json.drawCallbacks !== 'undefined') {
			for(index in json.drawCallbacks) {
				entity.addDrawCallback(DrawCallback.fromJson(json.drawCallbacks[index]));
			}
		}

		// Physics
		if(typeof json.body !== 'undefined') {
			entity.setBody(Body.fromJson(json.body, world));
		}
		
		// Behavior
		if(typeof json.trait !== 'undefined') {
			entity.setTrait(Trait.fromJson(json.trait));
		}

		return entity;
	};
	
	return Entity;
});
