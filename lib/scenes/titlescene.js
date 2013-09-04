Bloob.TitleScene = function(game, loop) {
	Bloob.Scene.apply(this, arguments);
	
	this.game = game;
	this.loop = loop;
	
	// mouseInteraction
	var that = this;
	this.mouse = new Bloob.Mouse(this.game.canvas)
		.onLeftClick(new Bloob.InteractionHandler()
			.onPressed(function() {
				Scarlet.log("TITLE TO MAP");
				that.stop();
				
				var newMapScene = new Bloob.MapScene(game, loop);
				newMapScene
					.onMapLoaded(
						Bloob.Utils.bind(function() {
							Bloob.MapBuilder.setUpTestMap(this);
							this.map.spawnPlayerAt(this, this.datGuiFolder);
							this.run();
						}, newMapScene)
					)
					.loadMap(game.config.startLevel);
			}))
		.onRightClick(new Bloob.InteractionHandler()
			.onPressed(function() {
				Scarlet.log("TITLE TO EDITOR");
				that.stop();
				var editorScene = new Bloob.EditorScene(game, loop);
				editorScene
					.onMapLoaded(
						Bloob.Utils.bind(function() {
							this.run();
						}, editorScene)
					)
					.loadMap(game.config.startLevel);
			}));
};

//inheritance
var chain = function() {};
chain.prototype = Bloob.Scene.prototype;
Bloob.TitleScene.prototype = new chain();
// enable static method inheritance
Bloob.TitleScene.__proto__ = Bloob.Scene;
Bloob.TitleScene.prototype.constructor = chain;
Bloob.TitleScene.prototype.parent = Bloob.Scene.prototype;

Bloob.TitleScene.prototype.update = function(timePassed) {
	this.mouse.update(timePassed);
};
