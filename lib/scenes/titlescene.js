Bloob.TitleScene = function(game, loop) {
	Bloob.Scene.apply(this, arguments);
	
	this.game = game;
	this.loop = loop;
	
	// mouseInteraction
	this.mouse = new Bloob.Mouse(this.game.canvas)
		.onLeftClick(new Bloob.InteractionHandler()
			.onPressed(function() {
				Scarlet.log("TITLE PRESSED");
				loop.remove("title");
				var mapScene1 = new Bloob.MapScene(game, loop).loadAndRun(game.config.startLevel);

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

Bloob.TitleScene.prototype.run = function() {
	this.loop.add(this, this.update, "title");
	return this;
};
