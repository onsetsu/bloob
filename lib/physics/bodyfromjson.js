define([
	"physics/jellyphysics",
	"physics/queue",
	"physics/objectpool",
	"physics/bitmask",
	"physics/collisiontype",
	"physics/internalspring",
	"physics/jellyprerequisites",
	"physics/vector2",
	"physics/pointmass",
	"physics/aabb",
	"physics/vectortools",
	"physics/closedshape",
	"physics/body",
	"physics/bodycollisioninfo",
	"physics/materialmanager",
	"physics/world",
	"physics/ray",
	"physics/bodybuilder",
	"physics/bodyblueprint",
	"physics/bodyfactory",
	"physics/joints/distancejoint",
	"physics/joints/pinjoint",
	"physics/joints/interpolationjoint",
	"physics/springbuilder",
	"physics/contactmanager",
	"physics/quadtree",
	"physics/triggerfield"
], function(
	JellyPhysics,
	Queue,
	ObjectPool,
	Bitmask,
	CollisionType,
	InternalSpring,
	JellyPrerequisites,
	Vector2,
	PointMass,
	AABB,
	VectorTools,
	ClosedShape,
	Body,
	BodyCollisionInfo,
	Material,
	World,
	Ray,
	BodyBuilder,
	BodyBlueprint,
	BodyFactory,
	DistanceJoint,
	PinJoint,
	InterpolationJoint,
	SpringBuilder,
	ContactManager,
	QuadTree,
	TriggerField
) {
	var JsonToBodyConverter = {};

	JsonToBodyConverter.convertJsonToBody = function(bodyJson, world) {
		// read bluePrint
		var bluePrint = BodyFactory.createBluePrint(bodyJson.class || "Body");

		if(typeof bodyJson.shape !== "undefined")
			bluePrint.shape(ClosedShape.fromJson(bodyJson.shape));

		JsonToBodyConverter.readBodyParameters(bluePrint, bodyJson);
		
		var body = bluePrint
			.world(world)
			.build();

		return body;
	};

	JsonToBodyConverter.readBodyParameters = function(bluePrint, jsonWithParameters) {
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
	       "gasPressure",
	       "internalSprings"
		];
		
		// iterate all possible parameter names
		for(var index in parameterNames) {
			if(!parameterNames.hasOwnProperty(index)) continue;

			var parameterName = parameterNames[index];
			
			// if parameter is defined in json...
			if(typeof jsonWithParameters[parameterName] !== "undefined") {
				// annotate blueprint
				if(parameterName == "translate" || parameterName == "scale") {
					// need to convert into Vector2
					var parameterValue = Vector2.fromJson(jsonWithParameters[parameterName]);
					bluePrint[parameterName](parameterValue);
				}
				else if(parameterName == "internalSprings") {
					// iterate over internalSprings array; attach each spring to bluePrint
					for(var index in jsonWithParameters["internalSprings"]) {
						if(!jsonWithParameters["internalSprings"].hasOwnProperty(index)) continue;
						var springParameters = jsonWithParameters["internalSprings"][index];
						InternalSpring.fromJson(springParameters, bluePrint);
					};
				}
				else
				{
					var parameterValue = jsonWithParameters[parameterName];
					bluePrint[parameterName](parameterValue);
				}
			};
		};
	};

	Body.fromJson = function(bodyJson, world) {
		return JsonToBodyConverter.convertJsonToBody(bodyJson, world);
	};

	return JsonToBodyConverter;
});
