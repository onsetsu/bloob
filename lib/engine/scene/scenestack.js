define(["engine/scene/transition"], function(Transition) {
	
	var SceneStack = mini.Class.subclass({
		initialize: function() {
			this._stack = [];
		},
		run: function(scene) {
			var stackSize = this._stack.length;
			if(stackSize == 0) {
				this._stack.push(scene);
				Bloob.mark(scene.sceneID);
			} else {
				Bloob.mark(this._stack[stackSize - 1].sceneID + " -> " + scene.sceneID);
				this._stack[stackSize - 1].stop();
				this._stack[stackSize - 1] = scene;
			}
			scene.run();
		},
		transitionTo: function(mapName) {
			new Transition(mapName).doIt();
		},
		push: function(scene) {
		},
		pop: function() {
		},
		top: function() {
			return this._stack[this._stack.length - 1];
		},
		inBetween: function(scene) {
			// TODO: define semantics
		},
		pause: function() {
			this.top().stop();
		},
		resume: function() {
			this.top().run();
		}
	});

	return SceneStack;
	
});
