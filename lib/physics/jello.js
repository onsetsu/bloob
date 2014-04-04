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
	var Jello = Jello || function() {};

	Jello.JellyPhysics = JellyPhysics;
	Jello.Queue = Queue;
	Jello.ObjectPool = ObjectPool;
	Jello.Bitmask = Bitmask;
	Jello.CollisionType = CollisionType;
	Jello.InternalSpring = InternalSpring;
	Jello.JellyPrerequisites = JellyPrerequisites;
	Jello.Vector2 = Vector2;
	Jello.PointMass = PointMass;
	Jello.AABB = AABB;
	Jello.VectorTools = VectorTools;
	Jello.ClosedShape = ClosedShape;
	Jello.Body = Body;
	Jello.BodyCollisionInfo = BodyCollisionInfo;
	Jello.Material = Material;
	Jello.World = World;
	Jello.Ray = Ray;
	Jello.BodyBuilder = BodyBuilder;
	Jello.BodyBlueprint = BodyBlueprint;
	Jello.BodyFactory = BodyFactory;
	Jello.DistanceJoint = DistanceJoint;
	Jello.PinJoint = PinJoint;
	Jello.InterpolationJoint = InterpolationJoint;
	Jello.SpringBuilder = SpringBuilder;
	Jello.ContactManager = ContactManager;
	Jello.QuadTree = QuadTree;
	Jello.TriggerField = TriggerField;
	
	var JsonToBodyConverter = {};

	JsonToBodyConverter.convertJsonToBody = function(bodyJson, world) {
		// read bluePrint
		var bluePrint = Jello.BodyFactory.createBluePrint(bodyJson.class || "Body");

		if(typeof bodyJson.shape !== "undefined")
			bluePrint.shape(Jello.ClosedShape.fromJson(bodyJson.shape));

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
					// need to convert into Jello.Vector2
					var parameterValue = Jello.Vector2.fromJson(jsonWithParameters[parameterName]);
					bluePrint[parameterName](parameterValue);
				}
				else if(parameterName == "internalSprings") {
					// iterate over internalSprings array; attach each spring to bluePrint
					for(var index in jsonWithParameters["internalSprings"]) {
						if(!jsonWithParameters["internalSprings"].hasOwnProperty(index)) continue;
						var springParameters = jsonWithParameters["internalSprings"][index];
						Jello.InternalSpring.fromJson(springParameters, bluePrint);
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

	Jello.Body.fromJson = function(bodyJson, world) {
		return JsonToBodyConverter.convertJsonToBody(bodyJson, world);
	};

	return Jello;
});
