define([
	"engine/scene",
	"engine/scenes/mapscene",
	"engine/scenes/transition",
	"engine/map/map",
	"assets/loader"
], function(Scene, MapScene, Transition, Map, Loader) {
	var TitleScene = MapScene.subclass({
		initialize: function() {
			MapScene.prototype.initialize.apply(this, arguments);
			
			this.setMap(new Map());
		},
		
		update: function() {
			// check for transition to MapScene
			if(env.input.pressed(env.game.LeftButton))
				new Transition(this, "twoMaps").doIt();
			else
				MapScene.prototype.update.apply(this, arguments);
		}
	});
	
	return TitleScene;
});
