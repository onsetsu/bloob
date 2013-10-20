mini.Module(
	"bloob/bloob"
)
.requires(
	"engine/main",
	"engine/game",
	"basic/audio/sound",
	"basic/audio/music",
	"bloob/scenes/titlescene"
)
.defines(function(main, Game, Sound, Track, TitleScene) {
	var BloobGame = Game.subclass({
		initialize: function() {
			Game.prototype.initialize.apply(this, arguments);
			
			this.testAudio();
			
			var titleScene = new TitleScene(this).run();
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
	
	// Start Game instance.
	main(BloobGame);
});
