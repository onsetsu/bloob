define([
	"physics/jellyphysics",
	"physics/queue",
	"physics/objectpool",
	"physics/bitmask",
	"physics/collisiontype",
	"physics/internalspring",
	"physics/jellyprerequisites",
	"physics/pointmass",
	"physics/aabb",
	"physics/closedshape",
	"physics/body",
	"physics/bodycollisioninfo",
	"physics/materialmanager",
	"physics/world",
	"physics/bodybuilder",
	"physics/bodyblueprint",
	"physics/bodyfactory",
	"physics/joints/distancejoint",
	"physics/joints/pinjoint",
	"physics/joints/interpolationjoint",
	"physics/springbuilder",
	"physics/contactmanager",
	"physics/quadtree",
	"physics/triggerfield",
	"physics/bodyfromjson",
	"physics/query"
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
	ClosedShape,
	Body,
	BodyCollisionInfo,
	Material,
	World,
	BodyBuilder,
	BodyBlueprint,
	BodyFactory,
	DistanceJoint,
	PinJoint,
	InterpolationJoint,
	SpringBuilder,
	ContactManager,
	QuadTree,
	TriggerField,
	JsonToBodyConverter,
	Query
) {
	var Jello = Jello || function() {};

	Jello.JellyPhysics = JellyPhysics;
	Jello.Queue = Queue;
	Jello.ObjectPool = ObjectPool;
	Jello.Bitmask = Bitmask;
	Jello.CollisionType = CollisionType;
	Jello.InternalSpring = InternalSpring;
	Jello.JellyPrerequisites = JellyPrerequisites;
	Jello.PointMass = PointMass;
	Jello.AABB = AABB;
	Jello.ClosedShape = ClosedShape;
	Jello.Body = Body;
	Jello.BodyCollisionInfo = BodyCollisionInfo;
	Jello.Material = Material;
	Jello.World = World;
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
	Jello.Query = Query;
	
	return Jello;
});
