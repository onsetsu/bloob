Bloob.EditorScene = function(game, loop) {
	Bloob.Scene.apply(this, arguments);
	
	this.game = game;
	this.loop = loop;
	
	// mouseInteraction
	var that = this;
	this.mouse = new Bloob.Mouse(this.game.canvas)
		.onLeftClick(new Bloob.InteractionHandler()
			.onPressed(function() {
				Scarlet.log("TITLE PRESSED");
				that.stop();
				
				var newMapScene = new Bloob.MapScene(game, loop);
				newMapScene
					.onMapLoaded(
						Bloob.Utils.bind(function blubmapLoaded() {
							Bloob.MapBuilder.setUpTestMap(this);
							this.map.spawnPlayerAt(this, this.datGuiFolder);
							this.run();
						}, newMapScene)
					)
					.loadMap(game.config.startLevel);
			}));
};

//inheritance
var chain = function() {};
chain.prototype = Bloob.Scene.prototype;
Bloob.EditorScene.prototype = new chain();
// enable static method inheritance
Bloob.EditorScene.__proto__ = Bloob.Scene;
Bloob.EditorScene.prototype.constructor = chain;
Bloob.EditorScene.prototype.parent = Bloob.Scene.prototype;

Bloob.EditorScene.prototype.update = function(timePassed) {
	this.mouse.update(timePassed);
};
