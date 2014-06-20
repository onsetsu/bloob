define([
	"engine/scene/mapscene",
	"assets/loader",
	"engine/map/map"
], function(MapScene, Loader, Map) {
	var Transition = function(toMapName) {
		this.toMapName = toMapName;
	};

	Transition.prototype.doIt = function() {
		if(Bloob.debug && Bloob.debug.datGui)
			Bloob.debug.datGui.removeFolder(env.sceneStack.top().sceneID);
		env.sceneStack.top().stop();

		// TODO: use preloaded transition.json in Loader
		var transitionMap = new Map("transition");
		Loader.load(function() {
			env.sceneStack.run(new MapScene().setMap(transitionMap));

			// actual loading of requested map
			var map = new Map(this.toMapName);
			Loader.load(function() {
				if(Bloob.debug && Bloob.debug.datGui)
					Bloob.debug.datGui.removeFolder(env.sceneStack.top().sceneID);
				env.sceneStack.top().stop();
		
				Bloob.log("Change map to '" + this.toMapName + "'");
				env.sceneStack.run(new MapScene().setMap(map));
			}, this);
		}, this);
	};

	return Transition;
});
