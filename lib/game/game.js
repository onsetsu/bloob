Bloob.Game = function() {
	this.config = Bloob.Config.read();
	this.init();
};

Bloob.Game.prototype.init = function() {
	// prepare stats
	this.stats = new Stats();
	$("body").prepend(this.stats.domElement);

	this.logic = new Bloob.Logic();
	this.world = new World();
	this.renderer = new DebugDraw(this.world);
	this.camera = new Bloob.MouseCamera(
		this.renderer,
		this.logic,
		this.world,
		this.world.mWorldLimits.Max.y - this.world.mWorldLimits.Min.y
	);
	this.camera.update();
	
	// mouseInteraction
	this.mouse = {};
	var thisMouse = this.mouse;
	// mouse drag
	this.mouse.input = new Scarlet.Input(this.renderer.canvasId);
	this.mouse.input.initMouse();
	//this.mouse.input.initKeyboard();
	this.mouse.input.bind(Scarlet.KEY.MOUSE1, "click");
	// mouse drag
	this.mouse.body = {};
	this.mouse.pmId = -1;
	this.mouse.drag = function drag(body) {
		var mouse = new Vector2(
			that.renderer.scaleX.invert(thisMouse.input.mouse.x),
			that.renderer.scaleY.invert(thisMouse.input.mouse.y)
		);
		var pointMass = body.pointMasses[thisMouse.pmId];
		var diff = VectorTools.calculateSpringForceVelAVelB(
			pointMass.Position,
			pointMass.Velocity,
			mouse,
			Vector2.Zero.copy(), // velB,
			0.0, // springD,
			100.0, // springK,
			10.0 // damping
		);
		pointMass.Force.addSelf(diff);
	};
	// end of mouseInteraction
	
	this.loop = new Scarlet.Loop();

	var that = this;
	Bloob.MapBuilder
		.onLoad(function(){ that.start.call(that); })
		.setUpTestMap(this);
		
	this.debugGui();
};

Bloob.Game.prototype.update = function(timePassed) {
	var that = this;
	timePassed = 1/60;
	this.stats.update();
	this.world.update(timePassed);
	this.logic.update(timePassed);
	
	// rendering
	this.camera.update();
	this.renderer.draw();

	// mouse drag
	if(this.mouse.input.pressed("click")) {
		var answer = that.world.getClosestPointMass(new Vector2(
			that.renderer.scaleX.invert(this.mouse.input.mouse.x),
			that.renderer.scaleY.invert(this.mouse.input.mouse.y)
		));
		this.mouse.body = that.world.getBody(answer.bodyId);
		this.mouse.body.addExternalForce(this.mouse.drag);
		this.mouse.pmId = answer.pointMassId;
	};
	if(this.mouse.input.released("click"))
		this.mouse.body.removeExternalForce(this.mouse.drag);
	this.mouse.input.clearPressed();
};

Bloob.Game.prototype.add = function(entity, body) {

};

Bloob.Game.prototype.start = function() {
	var that = this;
	var fn = function(timePassed) {
		that.update.call(that, timePassed);
	};
	this.__loopId__ = this.loop.start(fn);
};

Bloob.Game.prototype.stop = function() {
	this.loop.stop(this.__loopId__);
};



var Utils = {
	"fillArray": function(value, length) {
		arr = [];
		for(var i = 0; i < length; i++)
			arr.push(value);
		return arr;
	}
};

Bloob.Game.prototype.debugGui = function() {
	var obj = {
		"fn": function() {Scarlet.log("hallo");}
	};
//f1 = gui.addFolder('Size and Spacing');
	//f1.add(this.world.mDefaultMatPair, 'Friction').name('Friction').min(-1).max(1).listen().step(0.1).onChange(Scarlet.log);
	gui.add(this.world.materialManager.mMaterialPairs[Bloob.Material.Default][Bloob.Material.Default], 'Friction').name('Friction').min(-2).max(2).listen().step(0.1);
	gui.add(this.world.materialManager.mMaterialPairs[Bloob.Material.Default][Bloob.Material.Default], 'Elasticity').name('Elasticity').min(-2).max(2).listen().step(0.1);
	gui.add(World.gravitation, 'x').name('Gravitation_x').listen().min(-20).max(20).step(0.01);
	gui.add(World.gravitation, 'y').name('Gravitation_y').listen().min(-20).max(20).step(0.01);
	gui.add(obj, "fn").name('new Object');
};
