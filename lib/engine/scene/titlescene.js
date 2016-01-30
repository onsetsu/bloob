define([
	"engine/scene/scene",
	"engine/scene/mapscene",
	"engine/map/map",
	"assets/loader",
	"engine/input/input"
], function(Scene, MapScene, Map, Loader, Input) {
	var TitleScene = MapScene.subclass({
		initialize: function() {
			MapScene.prototype.initialize.apply(this, arguments);
			
			this.setMap(new Map("title"));

			env.input.initGamepad();
			env.input.bind(Input.GAMEPAD_KEY.BUTTON_1, 'A');
		},
		
		update: function() {
			// check for transition to MapScene
			if(env.input.pressed(env.game.LeftButton) || env.input.pressed('A'))
				env.sceneStack.loadAndRun("twoMaps");
			else
				MapScene.prototype.update.apply(this, arguments);
		}
	});
	
	return TitleScene;
});
