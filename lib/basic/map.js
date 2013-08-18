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
	// TODO: look, if already fetched from server
	// if so: convert json to map and call callbacks
	// load otherwise
	Bloob.Loader.loadMap(mapName, Bloob.Utils.bind(this.loadingFinished, this));
	return this;
};

Bloob.Map.prototype.loadingFinished = function(json) {
	this.convertToMap(json);
	
	// fire callbacks
	for(var index in this.callbacks) {
		this.callbacks[index](this);
	};
};

Bloob.Map.prototype.convertToMap = function(json) {
	// TODO: move converting into own class
	var shapes = this.convertShapes(json.shapes);
	var bluePrints = this.convertBluePrints(json.bluePrints, shapes);
	var bodies = this.convertBodies(json.bodies, shapes, bluePrints);
};

Bloob.Map.prototype.convertShapes = function(shapeJson) {
	var shapes = {};
	
	// read shapes
	for(var shapeName in shapeJson) {
		shapes[shapeName] = Bloob.Converter.readShape(shapeJson[shapeName]);
	};
	
	return shapes;
};

Bloob.Map.prototype.convertBluePrints = function(bluePrintJson, shapes) {
	var bluePrints = {};
	
	// read bluePrints
	for(var bluePrintName in bluePrintJson) {
		var bluePrintDescription = bluePrintJson[bluePrintName];
		var bluePrint = Bloob.BodyFactory.createBluePrint(window[bluePrintDescription.class] || Body)
			.shape(shapes[bluePrintDescription.shape]);

		this.readBodyParameters(bluePrint, bluePrintDescription);
		this.readInternalSprings(bluePrint, bluePrintDescription);
		
		bluePrints[bluePrintName] = bluePrint;
	};
	
	return bluePrints;
};

Bloob.Map.prototype.convertBodies = function(bodiesJson, shapes, bluePrints) {
	var bodies = {};

	// read bodies
	for(var bodyName in bodiesJson) {
		var bodySpecificDescription = bodiesJson[bodyName];
		Scarlet.log(bodySpecificDescription.bluePrint);
		var bluePrint = bluePrints[bodySpecificDescription.bluePrint];

		this.readBodyParameters(bluePrint, bodySpecificDescription);
		this.readInternalSprings(bluePrint, bodySpecificDescription);
		
		var body = bluePrint
			.world(this.world)
			.build();

		bodies[bodyName] = body;
	};
	
	return bodies;
};

Bloob.Map.prototype.readBodyParameters = function(bluePrint, jsonWithParameters) {
	var parameterNames = [
	                       "pointMasses",
	                       "translate",
	                       "rotate",
	                       "scale",
	                       "isKinematic",
	                       "edgeSpringK",
	                       "edgeSpringDamp",
	                       "shapeSpringK",
	                       "shapeSpringDamp",
	                       "gasPressure"
	];
	
	// iterate all possible parameter names
	for(var index in parameterNames) {
		var parameterName = parameterNames[index];
		
		// if parameter is defined in json...
		if(typeof jsonWithParameters[parameterName] !== "undefined") {
			// annotate blueprint
			if(parameterName == "translate" || parameterName == "scale") {
				// need to convert into Vector2
				var parameterValue = Bloob.Converter.readVector2(jsonWithParameters[parameterName]);
			}
			else
			{
				var parameterValue = jsonWithParameters[parameterName];
			}
			bluePrint[parameterName](parameterValue);
		};
	};
};
		
Bloob.Map.prototype.readInternalSprings = function(bluePrint, jsonWithParameters) {
	if(typeof jsonWithParameters["internalSprings"] !== "undefined") {
		for(var index in jsonWithParameters["internalSprings"]) {
			var springParameters = jsonWithParameters["internalSprings"][index];
			bluePrint.addInternalSpring(
				springParameters.pointA,
				springParameters.pointB,
				springParameters.springK,
				springParameters.springDamping
			);
		};
	};
};

Bloob.Map.prototype.spawnPlayerAt = function(scene, datGui) {
	/*
	 *  controllable blob:
	 */
	var pb = Bloob.BodyFactory.createBluePrint(PressureBody)
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
	mapFolder.add(this.world.materialManager.mMaterialPairs[Bloob.Material.Default][Bloob.Material.Default], 'Friction').name('Friction').min(-2).max(2).listen().step(0.1);
	mapFolder.add(this.world.materialManager.mMaterialPairs[Bloob.Material.Default][Bloob.Material.Default], 'Elasticity').name('Elasticity').min(-2).max(2).listen().step(0.1);
	mapFolder.add(World.gravitation, 'x').name('Gravitation_x').listen().min(-20).max(20).step(0.01);
	mapFolder.add(World.gravitation, 'y').name('Gravitation_y').listen().min(-20).max(20).step(0.01);
	mapFolder.add(obj, "fn").name('new Object');
	
	return this;
};
