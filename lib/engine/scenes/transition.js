define([
	"engine/scenes/mapscene",
	"assets/loader",
	"engine/map/map"
], function(MapScene, Loader, Map) {
	var Transition = function(fromScene, toMapName) {
		this.fromScene = fromScene;
		this.toMapName = toMapName;
	};

	Transition.prototype.doIt = function() {
		env.scene.stop();
		
		var map = new Map(this.toMapName);
		Loader.load(function() {
			Bloob.log("Change map to '" + this.toMapName + "'");
			new MapScene().setMap(map).run();
		}, this);
	};

	// enhance MapScene debug gui
	MapScene.prototype.testChangeMap = function() {
		if(Bloob.debug && Bloob.debug.datGui)
			Bloob.debug.datGui.removeFolder(this.sceneID);
		new Transition(this, "untitled").doIt();
	};
	
	return Transition;
});
