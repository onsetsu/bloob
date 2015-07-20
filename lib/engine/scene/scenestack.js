define([
	"engine/scene/mapscene",
	"assets/loader",
	"engine/map/map"
], function(MapScene, Loader, Map) { 'use strict';
	/* jshint esnext: true */

	class Stack {
		constructor() {
			this._stack = [];
		}

		push(elem) {
			this._stack.push(elem);
		}

		pop() {
			return this._stack.pop();
		}

		top() {
			return this._stack[this._stack.length - 1];
		}

		size() {
			return this._stack.length;
		}

		empty() {
			return this.size() === 0;
		}
	}
	
	var SceneStack = mini.Class.subclass({
		initialize: function() {
			this._stack = new Stack();
			this._paused = false;
		},
		run: function(scene) {
			var stackSize = this._stack.size();
			if(this._stack.empty()) {
				this._stack.push(scene);
				Bloob.mark(scene.sceneID);
			} else {
				Bloob.mark(this._stack.top().sceneID + " -> " + scene.sceneID);
				if(!this._paused) {
					this._stack.top().stop();
				}
				this._stack.pop();
				this._stack.push(scene);
			}
			scene.run();
			this._paused = false;
		},
		loadAndRun: function(mapName) {
			this._removeTopFolder();
			this.pause();

			// TODO: use preloaded transition.json in Loader
			var transitionMap = new Map("transition");
			Loader.load(function() {
				this.run(new MapScene().setMap(transitionMap));

				// actual loading of requested map
				var map = new Map(mapName);
				Loader.load(function() {
					this._removeTopFolder();
					this.pause();
			
					Bloob.log("Change map to '" + mapName + "'");
					this.run(new MapScene().setMap(map));
				}, this);
			}, this);
		},
		push: function(scene) {
			var stackSize = this._stack.size();
			if(stackSize > 0) {
				this._stack.top().stop();
				Bloob.mark(this._stack.top().sceneID + " -> " + scene.sceneID);
			}
			this._stack.push(scene);
			scene.run();
			this._paused = false;
		},
		loadAndPush: function(mapName) {
			this._removeTopFolder();
			this.pause();
			
			// actual loading of requested map
			var map = new Map(mapName);
			Loader.load(function() {
				Bloob.log("Push map to '" + mapName + "'");
				this.push(new MapScene().setMap(map));
			}, this);
		},
		pop: function() {
			this._removeTopFolder();
			var prevId = this._stack.top().sceneID;
			this._stack.pop().stop();
			var stackSize = this._stack.size();
			if(stackSize > 0) {
				var nextId = this._stack.top().sceneID;
				Bloob.mark(prevId + " -> " + nextId);
				if(Bloob.debug && Bloob.debug.datGui) {
					Bloob.debug.datGui.attachFolder(this._stack.top().datGuiFolder, nextId);
				}
				this._stack.top().run();
				this._paused = false;
			}
		},
		top: function() {
			return this._stack.top();
		},
		inBetween: function(scene) {
			// TODO: define semantics
		},
		pause: function() {
			this.top().stop();
			this._paused = true;
		},
		resume: function() {
			if(this._paused) {
				this.top().run();
			}
		},
		_removeTopFolder: function() {
			if(Bloob.debug && Bloob.debug.datGui) {
				Bloob.debug.datGui.removeFolder(this.top().sceneID);
			}
		}
	});
	
	// enhance MapScene debug gui
	MapScene.prototype.testChangeMap = function() {
		env.sceneStack.loadAndRun("untitled");
	};
	
	return SceneStack;
	
});
