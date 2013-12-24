mini.Module(
	"bloob/bloob"
)
.requires(
	"engine/core/bloob",
	"engine/main",
	"engine/game",
	"basic/audio/sound",
	"basic/audio/music",
	"bloob/scenes/titlescene",
	"logic/teleport",
	"debug/debug"
)
.defines(function(Bloob, main, Game, Sound, Track, TitleScene, Teleport, Debug) {
	var BloobGame = Game.subclass({
		testSound: new Sound("data/audio/sounds/test/cursor_sounds/water-bubble-high.wav"),
		testTrack: new Track("data/audio/music/test/217741_vibe_timid_girl.mp3"),
		
		initialize: function() {
			Game.prototype.initialize.apply(this, arguments);
			
			if(typeof env.audio.context !== "undefined") this.testAudio();
			
			var titleScene = new TitleScene(this).run();
		},

		testAudio: function() {
			var audioFolder = this.datGui.addFolder("Audio");
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
	});
	
	// Start Game instance.
	main(BloobGame, "bloobCanvas");
});
