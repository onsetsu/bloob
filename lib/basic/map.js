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

	var readBodyDescriptors = function(bluePrint, jsonForDescription) {
		var bodyDescriptors = [
		                       "pointMasses",
		                       "translate",
		                       "rotate",
		                       "scale",
		                       "isKinematic"
		];
		
		for(var index in bodyDescriptors) {
			var descriptor = bodyDescriptors[index];
			
			// if descriptor is defined in json...
			if(typeof jsonForDescription[descriptor] !== "undefined") {
				// annotate blueprint
				bluePrint[descriptor](jsonForDescription[descriptor]);
			};
		};
	};
	
	// read shapes
	for(var shapeName in json.shapes) {
		shapes[shapeName] = Bloob.Converter.readShape(json.shapes[shapeName]);
	};
	
	// read bluePrints
	for(var bluePrintName in json.bluePrints) {
		var bluePrintDescription = json.bluePrints[bluePrintName];
		var bluePrint = Bloob.BodyFactory.createBluePrint(window[bluePrintDescription.class] || Body)
			.shape(shapes[bluePrintDescription.shape]);

		readBodyDescriptors(bluePrint, bluePrintDescription);
		
		bluePrints[bluePrintName] = bluePrint;
	};
	
	// read bodies
	for(var bodyName in json.bodies) {
		var bodySpecificDescription = json.bodies[bodyName];
		var bluePrint = bluePrints[bodySpecificDescription.bluePrint];

		readBodyDescriptors(bluePrint, bodySpecificDescription);
		
		var body = bluePrint
			.world(this.world)
			.build();

		bodies[bodyName] = body;
	};
	
	// fire callbacks
	for(var index in this.callbacks) {
		this.callbacks[index](this);
	};
};
