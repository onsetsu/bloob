Bloob.TitleScene = function(game, loop) {
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
				
				var mapScene1 = new Bloob.MapScene(game, loop);
				mapScene1
					.onMapLoaded(
						Bloob.Utils.bind(function blubmapLoaded() {
							Bloob.MapBuilder.setUpTestMap(this);
							this.map.spawnPlayerAt(this, game.datGui);
							this.run();
						}, mapScene1)
					)
					.loadMap(game.config.startLevel);
			})
		);
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
