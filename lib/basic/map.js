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
	// now build map using the json
	var shapes = {};
	var bluePrints = {};
	var bodies = {};
	
	var bodyDescriptors = [
	                       "shape",
	                       "pointMasses",
	                       "translate",
	                       "rotate",
	                       "scale",
	                       "isKinematic"
	];

	// read shapes
	for(var shapeName in json.shapes) {
		shapes[shapeName] = Bloob.Converter.readShape(json.shapes[shapeName]);
	};
	
	// read bluePrints
	for(var bluePrintName in json.bluePrints) {
		var bluePrintDescription = json.bluePrints[bluePrintName];
		var bluePrint = Bloob.BodyFactory.createBluePrint(window[bluePrintDescription.class] || Body)
			.shape(shapes[bluePrintDescription.shape])
			.pointMasses(bluePrintDescription.pointMasses)
			.translate(Bloob.Converter.readVector2(bluePrintDescription.translate))
			.rotate(bluePrintDescription.rotate)
			.scale(Bloob.Converter.readVector2(bluePrintDescription.scale))
			.isKinematic(bluePrintDescription.isKinematic);
		
		bluePrints[bluePrintName] = bluePrint;
	};
	
	// read bodies
	for(var bodyName in json.bodies) {
		var bodyDescription = json.bodies[bodyName];
		var body = bluePrints[bodyDescription.bluePrint]
			.world(this.world)
			.translate(Bloob.Converter.readVector2(bodyDescription.translate))
			.build();
		
		bodies[bodyName] = body;
	};
	
	// fire callbacks
	for(var index in this.callbacks) {
		this.callbacks[index](this);
	};
};
