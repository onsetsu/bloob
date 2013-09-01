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
	
	this.initDatGui(game.datGui);
};

Bloob.Audio.context = (function init() {

})();

Bloob.Audio.buffers = {};
Bloob.Audio.prototype.buffers = {};

Bloob.Audio.prototype.initDatGui = function(datGui) {
	var audioFolder = datGui.addFolder("Audio");
	audioFolder.open();
	
	var testSound = new Bloob.Sound(this, "data/audio/sounds/test/cursor_sounds/water-bubble-high.wav");
	audioFolder.add(testSound, "play").name('play test sound');

	/*
	audioFolder.add(this.world.materialManager.mMaterialPairs[Bloob.Material.Default][Bloob.Material.Default], 'Friction').name('Friction').min(-2).max(2).listen().step(0.1);
	audioFolder.add(this.world.materialManager.mMaterialPairs[Bloob.Material.Default][Bloob.Material.Default], 'Elasticity').name('Elasticity').min(-2).max(2).listen().step(0.1);
	audioFolder.add(World.gravitation, 'x').name('Gravitation_x').listen().min(-20).max(20).step(0.01);
	audioFolder.add(World.gravitation, 'y').name('Gravitation_y').listen().min(-20).max(20).step(0.01);
	*/
};

