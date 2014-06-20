define([
	"engine/scene/mapscene",
	"assets/loader",
	"engine/map/map"
], function(MapScene, Loader, Map) {
	
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
		loadAndRun: function(mapName) {
			if(Bloob.debug && Bloob.debug.datGui)
				Bloob.debug.datGui.removeFolder(this.top().sceneID);
			this.top().stop();

			// TODO: use preloaded transition.json in Loader
			var transitionMap = new Map("transition");
			Loader.load(function() {
				this.run(new MapScene().setMap(transitionMap));

				// actual loading of requested map
				var map = new Map(mapName);
				Loader.load(function() {
					if(Bloob.debug && Bloob.debug.datGui)
						Bloob.debug.datGui.removeFolder(this.top().sceneID);
					this.top().stop();
			
					Bloob.log("Change map to '" + mapName + "'");
					this.run(new MapScene().setMap(map));
				}, this);
			}, this);
		},
		transitionTo: function(mapName) {
			this.loadAndRun(mapName);
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
	
	// enhance MapScene debug gui
	MapScene.prototype.testChangeMap = function() {
		env.sceneStack.transitionTo("untitled");
	};
	
	return SceneStack;
	
});
