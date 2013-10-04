mini.Module(
		"engine/game"
)
.requires(
		"engine/loop",
		"engine/config",
		"basic/canvas",
		"basic/audio/audio",
		"basic/audio/music",
		"basic/audio/sound",
		"bloob/scenes/titlescene"
)
.defines(function(Loop, Config, Canvas, Audio, Track, Sound, TitleScene) {
	var Game = mini.Class.subclass({
		initialize: function(configuration) {
			this.config = configuration || Config.getDefault();
			this.id = Game.nextGameID++;
			console.log("NEW GAME: " + this.id);
			this.init();			
		},
		init: function() {
			// prepare datGui
			this.datGui = new dat.GUI();

			// prepare stats
			this.stats = new Stats();
			$("body").prepend(this.stats.domElement);
			
			// Configure and start the game loop.
			this.loop = new Loop()
				.clear()
				.add(this.stats, this.stats.update)
				.start();

			this.canvas = new Canvas({canvasId: "bloobCanvas" + this.id});
			this.audio = new Audio();
			this.testAudio();
			
			var titleScene = new TitleScene(this, this.loop).run();
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

	Game.nextGameID = 0;
	
	return Game;
});
