window.Bloob = window.Bloob  || {};

/*
	// basic
	.include(includePath + "external/" + "libraryextensions")
	.include(basicPath + "constants")
	.include(basicPath + "utils")
	.include(basicPath + "uniqueidgenerator")
	
	.include(assetsPath + "assetmanager")
	.include(assetsPath + "loadassembler")
	.include(assetsPath + "loader")

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

	.include(renderingPath + "debugdraw/debugdraw")
	// basic canvas
	.include(basicPath + "canvas")

	// basic for map
	.include(basicPath + "map")
	// from json conversion
	.include(assetsPath + "converter/fromjson/jsontovector2converter")
	.include(assetsPath + "converter/fromjson/jsontointernalspringconverter")
	.include(assetsPath + "converter/fromjson/jsontoclosedshapeconverter")
	.include(assetsPath + "converter/fromjson/jsontobodyconverter")
	.include(assetsPath + "converter/fromjson/jsontoworldconverter")
	.include(assetsPath + "converter/decompressmapjson")
	.include(assetsPath + "converter/fromjson/jsontomapconverter")
	// to json conversion
	.include(assetsPath + "converter/tojson/vector2tojsonconverter")
	.include(assetsPath + "converter/tojson/internalspringtojsonconverter")
	.include(assetsPath + "converter/tojson/closedshapetojsonconverter")
	.include(assetsPath + "converter/tojson/bodytojsonconverter")
	.include(assetsPath + "converter/tojson/worldtojsonconverter")
	.include(assetsPath + "converter/tojson/maptojsonconverter")

	// logic
	.include(logicPath + "entity")
	
	// basic for builder
	.include(basicPath + "shapebuilder")
	.include(basicPath + "mapbuilder")


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
	*/

mini.Module(
	"bloob/bloob"
)
.requires(
	"engine/main",
	"engine/game",
	"engine/config",
	"basic/audio/sound",
	"basic/audio/music"
)
.defines(function(main, Game, Config, Sound, Track) {
	// TODO: extract Game subclass for Bloob
	var BloobGame = Game.subclass({
		initialize: function(configuration) {
			Game.prototype.initialize.apply(this, arguments);
			
			this.testAudio();
		},

		testAudio: function() {
			var audioFolder = this.datGui.addFolder("Audio");
			audioFolder.open();
			audioFolder.add(this.audio.trackParent.gain, 'value').name('TrackVolume').min(0.0).max(1.0).listen().step(0.1);
			audioFolder.add(this.audio.soundParent.gain, 'value').name('SoundVolume').min(0.0).max(1.0).listen().step(0.1);

			var testSound = new Sound(this.audio, "data/audio/sounds/test/cursor_sounds/water-bubble-high.wav");
			audioFolder.add(testSound, "play").name('play test sound');

			var testTrack = new Track(this.audio, "data/audio/music/test/217741_vibe_timid_girl.mp3");
			audioFolder.add(testTrack, "play").name('play test track');
			audioFolder.add(testTrack, '_volume')
				.name('track volume')
				.min(0.0)
				.max(1.0)
				.listen()
				.step(0.1)
				.onChange(function(volume) {
					testTrack.setVolume(volume);
				});
		}
	});
	
	// start several Game instances
	main(BloobGame, new Config().setStartLevel("SecondMap"));
	main(BloobGame, new Config().setStartLevel("SecondMap"));
	main(BloobGame);
});
