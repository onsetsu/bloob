mini.Module(
	"physics/jello"
)
.requires(
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
	"physics/springbody",
	"physics/pressurebody",
	"physics/ray",
	"physics/bodybuilder",
	"physics/bodyblueprint",
	"physics/bodyfactory",
	"physics/particle",
	"physics/particlecannon",
	"physics/joints/distancejoint",
	"physics/joints/pinjoint",
	"physics/joints/interpolationjoint",
	"physics/springbuilder",
	"physics/contactmanager",
	"physics/quadtree",
	"physics/triggerfield"
)
.defines(function(
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
	SpringBody,
	PressureBody,
	Ray,
	BodyBuilder,
	BodyBlueprint,
	BodyFactory,
	Particle,
	ParticleCannon,
	DistanceJoint,
	PinJoint,
	InterpolationJoint,
	SpringBuilder,
	ContactManager,
	QuadTree,
	TriggerField
) {
	Jello = Jello || function() {};

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
	Jello.SpringBody = SpringBody;
	Jello.PressureBody = PressureBody;
	Jello.Ray = Ray;
	Jello.BodyBuilder = BodyBuilder;
	Jello.BodyBlueprint = BodyBlueprint;
	Jello.BodyFactory = BodyFactory;
	Jello.Particle = Particle;
	Jello.ParticleCannon = ParticleCannon;
	Jello.DistanceJoint = DistanceJoint;
	Jello.PinJoint = PinJoint;
	Jello.InterpolationJoint = InterpolationJoint;
	Jello.SpringBuilder = SpringBuilder;
	Jello.ContactManager = ContactManager;
	Jello.QuadTree = QuadTree;
	Jello.TriggerField = TriggerField;
	
	return Jello;
});
