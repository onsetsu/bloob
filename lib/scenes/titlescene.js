Bloob.TitleScene = function(game, loop) {
	Bloob.Scene.apply(this, arguments);
	
	this.game = game;
	this.canvas = this.game.canvas;
	this.loop = loop;
	
	this.map = new Bloob.Map();
	this.logic = this.map.logic;
	this.world = this.map.world;
	
	this.camera = new Bloob.Camera(
			this.canvas,
			this.logic,
			this.world,
			this.world.mWorldLimits.Max.y - this.world.mWorldLimits.Min.y
		);
	this.renderer = new DebugDraw(this.world, this.canvas, this.camera);
	this.camera.update();

	// mouseInteraction
	this.mouse = new Bloob.Mouse(this.world, this.camera, this)
		.onLeftClick("DRAG_BODY")
		.onRightClick("SPAWN_CUBE");
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
	// entities/map
	this.world.update(timePassed);
	this.logic.update(timePassed);
	// rendering
	this.camera.update(timePassed);
	this.renderer.draw(timePassed);
	// interaction
	this.mouse.update(timePassed);
};

Bloob.TitleScene.prototype.run = function() {
	this.loop.add(this, this.update);
	return this;
};
