define([
	"engine/scene/mapscene",
	"assets/loader",
	"engine/map/map"
], function(MapScene, Loader, Map) {
	var Transition = function(fromScene, toMapName) {
		this.fromScene = fromScene;
		this.toMapName = toMapName;
	};

	Transition.prototype.doIt = function() {
		if(Bloob.debug && Bloob.debug.datGui)
			Bloob.debug.datGui.removeFolder(env.scene.sceneID);
		env.scene.stop();

		// TODO: use preloaded transition.json in Loader
		var transitionMap = new Map("transition");
		Loader.load(function() {
			new MapScene().setMap(transitionMap).run();

			// actual loading of requested map
			var map = new Map(this.toMapName);
			Loader.load(function() {
				if(Bloob.debug && Bloob.debug.datGui)
					Bloob.debug.datGui.removeFolder(env.scene.sceneID);
				env.scene.stop();
		
				Bloob.log("Change map to '" + this.toMapName + "'");
				new MapScene().setMap(map).run();
			}, this);
		}, this);
	};

	// enhance MapScene debug gui
	MapScene.prototype.testChangeMap = function() {
		new Transition(this, "untitled").doIt();
	};
	
	return Transition;
});
