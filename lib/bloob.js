window.Bloob= {};

var includePath = "../../Bloob/lib/"; // include path relative to scarlet.js

var basicPath = includePath + "basic/";
var physicsPath = includePath + "physics/";
var logicPath = includePath + "logic/";
var scenesPath = includePath + "scenes/";
var gamePath = includePath + "game/";

Scarlet
	// basic
	.include(basicPath + "libraryextensions")
	.include(basicPath + "utils")
	.include(basicPath + "loader")
	.include(basicPath + "gui")
	.include(basicPath + "camera")
	.include(basicPath + "interactionhandler")
	.include(basicPath + "interactionhandlerbuilder")

	// physics
	.include(physicsPath + "jellyphysics")

	.include(physicsPath + "queue")

	.include(physicsPath + "bitmask")

	.include(physicsPath + "internalspring")

	.include(physicsPath + "jellyprerequisites")
	.include(physicsPath + "vector2")
	.include(physicsPath + "pointmass")
	.include(physicsPath + "aabb") // needs vector2
	.include(physicsPath + "vectortools") // needs vector2, jellyprerequisites
	.include(physicsPath + "closedshape") // needs VectorTools, JellyPrerequisites, Vector2 
	
	.include(physicsPath + "body") // needs VectorTools, JellyPrerequisites, Vector2, ClosedShape, Bitmask, AABB, PointMass
	.include(physicsPath + "bodycollisioninfo") // vector2
	.include(physicsPath + "materialmanager")
	.include(physicsPath + "world")
	.include(physicsPath + "springbody") // Body, InternalSpring, World, VectorTools
	.include(physicsPath + "pressurebody") // springbody
	
	.include(physicsPath + "ray") // vector, ...
	.include(physicsPath + "bodyfactory") // provides chainable interface for creation of bodies
	.include(physicsPath + "particle") //
	.include(physicsPath + "particlecannon") //

	.include(physicsPath + "joints/distancejoint") //
	.include(physicsPath + "joints/pinjoint") //
	.include(physicsPath + "joints/interpolationjoint") //
	
	.include(physicsPath + "springbuilder") // springbody
	
	.include(physicsPath + "debugdraw")
	
	.include(physicsPath + "contactmanager")

	// basic canvas
	.include(basicPath + "canvas")
	// basic for map
	.include(basicPath + "converter")
	.include(basicPath + "map")
	// basic for builder
	.include(basicPath + "shapebuilder")
	.include(basicPath + "bodybuilder")
	.include(basicPath + "mapbuilder")

	// logic
	.include(logicPath + "logic")
	.include(logicPath + "entity")

	// TODO: move mouse to top after refactoring
	.include(basicPath + "mouse")
	// scenes
	.include(scenesPath + "scene")
	.include(scenesPath + "mapscene")
	.include(scenesPath + "titlescene")
	.include(scenesPath + "transition")

	// game
	.include(gamePath + "loop")
	.include(gamePath + "config")
	.include(gamePath + "game")
	.include(gamePath + "main");
	;
