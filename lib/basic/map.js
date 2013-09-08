// Repository of loaded json-maps
Bloob.MapRepository = {};

Bloob.Map = function() {
	this.logic = new Bloob.Logic();
	this.world = new World();
	
	this.callbacks = [];
};

Bloob.Map.prototype.onBuildFinished = function(callback) {
	this.callbacks.push(callback);
	return this;
};

Bloob.Map.prototype.build = function(mapName) {
	// TODO: look, if already fetched from server (implemented by assetmanager)
	// if so: convert json to map and call callbacks
	// load otherwise
	Bloob.Loader.loadMap(mapName, Bloob.Utils.bind(this.loadingFinished, this));
	return this;
};

Bloob.Map.prototype.loadingFinished = function(json) {
	// convert given json to map
	Bloob.JsonToMapConverter.convertJsonToMap(json, this);
	
	// fire callbacks
	for(var index in this.callbacks) {
		this.callbacks[index](this);
	};
};

Bloob.Map.prototype.spawnPlayerAt = function(scene, datGui) {
	/*
	 *  controllable blob:
	 */
	var pb = Jello.BodyFactory.createBluePrint(Jello.PressureBody)
		.world(scene.world)
		.shape(Bloob.ShapeBuilder.Shapes.Ball)
		.pointMasses(1.0)
		.translate(new Vector2(-25, 15))
		.rotate(0)
		.scale(Vector2.One.copy().mulFloat(2.0))
		.isKinematic(false)
		.edgeSpringK(300.0)
		.edgeSpringDamp(20.0)
		.shapeSpringK(150.0)
		.shapeSpringDamp(1.0)
		.gasPressure(100.0)
		.build();
	
	var foo = datGui.add(pb, 'mGasAmount').name('gasPressure').min(0).max(5000).listen().step(1);
	
	pb.aName = "Player";
	var input = new Scarlet.Input(scene.renderer.canvasId);
	input.initKeyboard();
	input.bind(Scarlet.KEY.LEFT_ARROW, "left");
	input.bind(Scarlet.KEY.RIGHT_ARROW, "right");
	input.bind(Scarlet.KEY.UP_ARROW, "up");
	input.bind(Scarlet.KEY.DOWN_ARROW, "down");
	input.bind(Scarlet.KEY.DOWN_ARROW, "compress");

	var blob = new Bloob.Entity();
	blob.update = function(x) {
		if(input.state("left")) {
			//this.body.addGlobalForce(this.body.mDerivedPos, new Vector2(-3, 0));
			this.body.addGlobalRotationForce(10);
		} else if(input.state("right")) {
			//this.body.addGlobalForce(this.body.mDerivedPos, new Vector2(3, 0));
			this.body.addGlobalRotationForce(-10);
		} else if(input.state("up")) {
			this.body.addGlobalForce(this.body.mDerivedPos, new Vector2(0, 3));
		} else if(input.state("down")) {
			this.body.addGlobalForce(this.body.mDerivedPos, new Vector2(0, -3));
		};
		if(input.pressed("compress")) {
			this.body.setGasPressure(this.body.getGasPressure() / 10);
			this.body.setShapeMatchingConstants(250, 5);
		} else if(input.released("compress")) {
			this.body.setGasPressure(this.body.getGasPressure() * 10);
			this.body.setShapeMatchingConstants(150, 1);
		};
		input.clearPressed();

	};
	scene.logic.addEntity(blob);
	pb.setEntity(blob);
	blob.makeSticky(datGui);

	// track camera focus on blob
	scene.camera.track(pb);
};

Bloob.Map.prototype.initDatGui = function(datGui) {
	var obj = {
		"fn": function() {Scarlet.log("hallo");}
	};
	
	var mapFolder = datGui.addFolder('Map');
	mapFolder.open();
	mapFolder.add(this.world.materialManager.mMaterialPairs[Jello.Material.Default][Jello.Material.Default], 'Friction').name('Friction').min(-2).max(2).listen().step(0.1);
	mapFolder.add(this.world.materialManager.mMaterialPairs[Jello.Material.Default][Jello.Material.Default], 'Elasticity').name('Elasticity').min(-2).max(2).listen().step(0.1);
	mapFolder.add(World.gravitation, 'x').name('Gravitation_x').listen().min(-20).max(20).step(0.01);
	mapFolder.add(World.gravitation, 'y').name('Gravitation_y').listen().min(-20).max(20).step(0.01);
	mapFolder.add(obj, "fn").name('new Object');
	
	return this;
};
