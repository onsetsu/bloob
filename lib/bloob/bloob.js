define([
	"engine/core/bloob",
	"engine/main",
	"engine/game",
	"basic/audio/sound",
	"basic/audio/music",
	"engine/input",
	"bloob/scenes/titlescene",
	"logic/teleport",
	"editor/server",
	"debug/debug"
], function(
	Bloob,
	main,
	Game,
	Sound,
	Track,
	Input,
	TitleScene,
	Teleport,
	Server,
	Debug
) {
	var BloobGame = Game.subclass({
		testSound: new Sound("data/audio/sounds/test/cursor_sounds/water-bubble-high.wav"),
		testTrack: new Track("data/audio/music/test/217741_vibe_timid_girl.mp3"),
		
		initialize: function() {
			Game.prototype.initialize.apply(this, arguments);
			
			this.testSave();
			if(typeof env.audio.context !== "undefined") this.testAudio();
			
			// prepare input
			env.input.initKeyboard();
			env.input.bind(Input.KEY.LEFT_ARROW, this.Left);
			env.input.bind(Input.KEY.RIGHT_ARROW, this.Right);
			env.input.bind(Input.KEY.UP_ARROW, this.Up);
			env.input.bind(Input.KEY.DOWN_ARROW, this.Down);

			// prepare input
			env.input.initMouse();
			env.input.bind(Input.KEY.MOUSE1, this.LeftButton);
			env.input.bind(Input.KEY.MOUSE2, this.RightButton);

			var titleScene = new TitleScene().run();
		},
		
		Left: "left",
		Right: "right",
		Up: "up",
		Down: "down",
		
		LeftButton: "leftclick",
		RightButton: "rightclick",

		testAudio: function() {
			if(Bloob.debug && Bloob.debug.datGui) {
				var audioFolder = Bloob.debug.datGui.addFolder("Audio");
				audioFolder.open();
				audioFolder.add(env.audio.trackParent.gain, 'value').name('TrackVolume').min(0.0).max(1.0).listen().step(0.1);
				audioFolder.add(env.audio.soundParent.gain, 'value').name('SoundVolume').min(0.0).max(1.0).listen().step(0.1);
	
				audioFolder.add(this.testSound, "play").name('play test sound');
	
				audioFolder.add(this.testTrack, "play").name('play test track');
				audioFolder.add(this.testTrack, '_volume')
					.name('track volume')
					.min(0.0)
					.max(1.0)
					.listen()
					.step(0.1)
					.onChange(function(volume) {
						testTrack.setVolume(volume);
					});
			}
		},

		testSave: function() {
			// test for map to json conversion
			var that = this;
			var toJson = {
				"save as": "untitled.json",
				"SAVE": function() {
					Bloob.log(env.scene);
					Server.save(
						"data/maps/" + toJson["save as"],
						JSON.stringify(env.scene.getMap().toJson(), undefined, 2)
					);
				}
			};
			if(Bloob.debug && Bloob.debug.datGui) {
				Bloob.debug.datGui.add(toJson, "save as");
				Bloob.debug.datGui.add(toJson, "SAVE");
			}
		}
	});
	
	// Start Game instance.
	main(BloobGame, "bloobCanvas", 1000, 400);
});
