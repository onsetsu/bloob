define(function() { 'use strict';
	/* jshint esnext: true */

	var Game = mini.Class.subclass({
		initialize: function() {
			Bloob.log("NEW GAME");
			env.game = this;
		}
	});
	
	return Game;
});
