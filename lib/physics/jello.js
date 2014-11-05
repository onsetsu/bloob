define([
	"./jellyphysics",
	"./queue",
	"./objectpool",
	"./bitmask",
	"./collisiontype",
	"./internalspring",
	"./utils",
	"./pointmass",
	"./aabb",
	"./closedshape",
	"./body",
	"./bodycollisioninfo",
	"./materialmanager",
	"./world",
	"./bodybuilder",
	"./bodyblueprint",
	"./bodyfactory",
	"./joints/distancejoint",
	"./joints/pinjoint",
	"./joints/interpolationjoint",
	"./springbuilder",
	"./contactmanager",
	"./quadtree",
	"./triggerfield",
	"./bodyfromjson",
	"./query"
], function(
	JellyPhysics,
	Queue,
	ObjectPool,
	Bitmask,
	CollisionType,
	InternalSpring,
	utils,
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
	Jello.utils = utils;
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
