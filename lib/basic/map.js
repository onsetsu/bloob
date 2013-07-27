// Repository of loaded json-maps
Bloob.MapRepository = {};

Bloob.Map = function() {
	this.logic = new Bloob.Logic();
	this.world = new World();
	
	this.callbacks = [];
	
	this.initDatGui();
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
	var shapes = this.convertShapes(json.shapes);
	var bluePrints = this.convertBluePrints(json.bluePrints, shapes);
	var bodies = this.convertBodies(json.bodies, shapes, bluePrints);
	
	// fire callbacks
	for(var index in this.callbacks) {
		this.callbacks[index](this);
	};
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
	Scarlet.log("call method", bluePrint, jsonWithParameters);
	if(typeof jsonWithParameters["internalSprings"] !== "undefined") {
		Scarlet.log("springs defined");
		for(var index in jsonWithParameters["internalSprings"]) {
			Scarlet.log("inside for-loop");
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


Bloob.Map.prototype.initDatGui = function() {
	var obj = {
		"fn": function() {Scarlet.log("hallo");}
	};
	
	var generalFolder = gui.addFolder('Map');
	generalFolder.open();
	//f1.add(this.world.mDefaultMatPair, 'Friction').name('Friction').min(-1).max(1).listen().step(0.1).onChange(Scarlet.log);
	generalFolder.add(this.world.materialManager.mMaterialPairs[Bloob.Material.Default][Bloob.Material.Default], 'Friction').name('Friction').min(-2).max(2).listen().step(0.1);
	generalFolder.add(this.world.materialManager.mMaterialPairs[Bloob.Material.Default][Bloob.Material.Default], 'Elasticity').name('Elasticity').min(-2).max(2).listen().step(0.1);
	generalFolder.add(World.gravitation, 'x').name('Gravitation_x').listen().min(-20).max(20).step(0.01);
	generalFolder.add(World.gravitation, 'y').name('Gravitation_y').listen().min(-20).max(20).step(0.01);
	generalFolder.add(obj, "fn").name('new Object');
};
