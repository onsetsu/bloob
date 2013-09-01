Bloob.Audio = function(game) {
	try {
		// Fix up for prefixing
		window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"];
		this.context = new window["AudioContext"]();
	}
	catch(e) {
		alert('Web Audio API is not supported in this browser');
		return undefined;
	}
	
	this.buffers = {};
	this.initDatGui(game.datGui);
};

Bloob.Audio.prototype.initDatGui = function(datGui) {
	var audioFolder = datGui.addFolder("Audio");
	audioFolder.open();
	
	var testSound = new Bloob.Sound(this, "data/audio/sounds/test/cursor_sounds/water-bubble-high.wav");
	audioFolder.add(testSound, "play").name('play test sound');

	var testTrack = new Bloob.Track(this, "data/audio/music/test/217741_vibe_timid_girl.mp3");
	audioFolder.add(testTrack, "play").name('play test track');
	audioFolder.add(testTrack, '_volume')
		.name('track volume')
		.min(0.0)
		.max(1.0)
		.listen()
		.step(0.05)
		.onChange(function(volume) {
			testTrack.setVolume(volume);
		});
	/*
	audioFolder.add(this.world.materialManager.mMaterialPairs[Bloob.Material.Default][Bloob.Material.Default], 'Friction').name('Friction').min(-2).max(2).listen().step(0.1);
	audioFolder.add(this.world.materialManager.mMaterialPairs[Bloob.Material.Default][Bloob.Material.Default], 'Elasticity').name('Elasticity').min(-2).max(2).listen().step(0.1);
	audioFolder.add(World.gravitation, 'x').name('Gravitation_x').listen().min(-20).max(20).step(0.01);
	audioFolder.add(World.gravitation, 'y').name('Gravitation_y').listen().min(-20).max(20).step(0.01);
	*/
};

