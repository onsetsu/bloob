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
	var shapes = {};
	var bluePrints = {};
	var bodies = {};

	var readBodyParameters = function(bluePrint, jsonWithParameters) {
		var parameterNames = [
		                       "pointMasses",
		                       "translate",
		                       "rotate",
		                       "scale",
		                       "isKinematic"
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
	
	// read shapes
	for(var shapeName in json.shapes) {
		shapes[shapeName] = Bloob.Converter.readShape(json.shapes[shapeName]);
	};
	
	// read bluePrints
	for(var bluePrintName in json.bluePrints) {
		var bluePrintDescription = json.bluePrints[bluePrintName];
		var bluePrint = Bloob.BodyFactory.createBluePrint(window[bluePrintDescription.class] || Body)
			.shape(shapes[bluePrintDescription.shape]);

		readBodyParameters(bluePrint, bluePrintDescription);
		
		bluePrints[bluePrintName] = bluePrint;
	};
	
	// read bodies
	for(var bodyName in json.bodies) {
		var bodySpecificDescription = json.bodies[bodyName];
		var bluePrint = bluePrints[bodySpecificDescription.bluePrint];

		readBodyParameters(bluePrint, bodySpecificDescription);
		
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
