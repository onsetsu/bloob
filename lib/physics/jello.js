define(function(require) {
	var Jello = Jello || function() {};

	Jello.Queue = require("./queue");
	Jello.ObjectPool = require("./objectpool");
	Jello.Bitmask = require("./bitmask");
	Jello.CollisionType = require("./collisiontype");
	Jello.InternalSpring = require("./internalspring");
	Jello.utils = require("./utils");
	Jello.PointMass = require("./pointmass");
	Jello.AABB = require("./aabb");
	Jello.ClosedShape = require("./closedshape");
	Jello.Body = require("./body");
	Jello.BodyCollisionInfo = require("./bodycollisioninfo");
	Jello.Material = require("./materialmanager");
	Jello.World = require("./world");
	Jello.BodyBuilder = require("./bodybuilder");
	Jello.BodyBlueprint = require("./bodyblueprint");
	Jello.BodyFactory = require("./bodyfactory");
	Jello.DistanceJoint = require("./joints/distancejoint");
	Jello.PinJoint = require("./joints/pinjoint");
	Jello.InterpolationJoint = require("./joints/interpolationjoint");
	Jello.SpringBuilder = require("./springbuilder");
	Jello.ContactManager = require("./contactmanager");
	Jello.QuadTree = require("./quadtree");
	Jello.TriggerField = require("./triggerfield");
	Jello.BodyFromJson = require("./bodyfromjson");
	Jello.Query = require("./query");

	return Jello;
});
