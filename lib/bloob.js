window.Bloob = window.Bloob  || {};

var includePath = "../../Bloob/lib/"; // include path relative to scarlet.js

var basicPath = includePath + "basic/";
var assetsPath = includePath + "assets/";
var physicsPath = includePath + "physics/";
var logicPath = includePath + "logic/";
var scenesPath = includePath + "scenes/";
var gamePath = includePath + "game/";

Scarlet
	// basic
	.include(basicPath + "libraryextensions")
	.include(basicPath + "constants")
	.include(basicPath + "utils")
	.include(basicPath + "uniqueidgenerator")
	
	.include(assetsPath + "assetmanager")
	.include(basicPath + "loader")

	.include(basicPath + "gui")
	.include(basicPath + "camera")
	.include(basicPath + "interactionhandler")
	.include(basicPath + "interactionhandlerbuilder")
	
	// audio
	.include(basicPath + "audio/audio")
	.include(basicPath + "audio/sound")
	.include(basicPath + "audio/music")

	// physics
	// lib already included in .html
	//.include(physicsPath + "jellyphysics")

	//.include(physicsPath + "queue")

	//.include(physicsPath + "bitmask")

	//.include(physicsPath + "internalspring")

	//.include(physicsPath + "jellyprerequisites")
	//.include(physicsPath + "vector2")
	//.include(physicsPath + "pointmass")
	//.include(physicsPath + "aabb") // needs vector2
	//.include(physicsPath + "vectortools") // needs vector2, jellyprerequisites
	//.include(physicsPath + "closedshape") // needs VectorTools, JellyPrerequisites, Vector2 
	
	//.include(physicsPath + "body") // needs VectorTools, JellyPrerequisites, Vector2, ClosedShape, Bitmask, AABB, PointMass
	//.include(physicsPath + "bodycollisioninfo") // vector2
	//.include(physicsPath + "materialmanager")
	//.include(physicsPath + "world")
	//.include(physicsPath + "springbody") // Body, InternalSpring, World, VectorTools
	//.include(physicsPath + "pressurebody") // springbody
	
	//.include(physicsPath + "ray") // vector, ...

	//.include(physicsPath + "bodybuilder")
	//.include(physicsPath + "bodyblueprint") // provides chainable interface for creation of bodies
	//.include(physicsPath + "bodyfactory") //
	//.include(physicsPath + "particle") //
	//.include(physicsPath + "particlecannon") //

	//.include(physicsPath + "joints/distancejoint") //
	//.include(physicsPath + "joints/pinjoint") //
	//.include(physicsPath + "joints/interpolationjoint") //
	
	//.include(physicsPath + "springbuilder") // springbody
	
	//.include(physicsPath + "contactmanager")

	.include(physicsPath + "debugdraw")
	
	// basic canvas
	.include(basicPath + "canvas")
	// basic for map
	.include(basicPath + "map")
	// from json conversion
	.include(includePath + "assets/converter/fromjson/jsontovector2converter")
	.include(includePath + "assets/converter/fromjson/jsontointernalspringconverter")
	.include(includePath + "assets/converter/fromjson/jsontoclosedshapeconverter")
	.include(includePath + "assets/converter/fromjson/jsontobodyconverter")
	.include(includePath + "assets/converter/fromjson/jsontoworldconverter")
	.include(includePath + "assets/converter/decompressmapjson")
	.include(includePath + "assets/converter/fromjson/jsontomapconverter")
	// to json conversion
	.include(includePath + "assets/converter/tojson/vector2tojsonconverter")
	.include(includePath + "assets/converter/tojson/internalspringtojsonconverter")
	.include(includePath + "assets/converter/tojson/closedshapetojsonconverter")
	.include(includePath + "assets/converter/tojson/bodytojsonconverter")
	.include(includePath + "assets/converter/tojson/worldtojsonconverter")
	.include(includePath + "assets/converter/tojson/maptojsonconverter")
	// basic for builder
	.include(basicPath + "shapebuilder")
	.include(basicPath + "mapbuilder")

	// logic
	.include(logicPath + "logic")
	.include(logicPath + "entity")

	// TODO: move mouse to top after refactoring
	.include(basicPath + "mouse")
	// scenes
	.include(scenesPath + "scene")
	.include(scenesPath + "mapscene")
	.include(scenesPath + "editorscene")
	.include(scenesPath + "titlescene")
	.include(scenesPath + "transition")

	// game
	.include(gamePath + "loop")
	.include(gamePath + "config")
	.include(gamePath + "game")
	.include(gamePath + "main");
	;
