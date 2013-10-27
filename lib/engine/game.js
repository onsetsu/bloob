mini.Module(
	"engine/game"
)
.requires(
	"engine/loop"
)
.defines(function(Loop) {
	var Game = mini.Class.subclass({
		initialize: function() {
			console.log("NEW GAME");
			env.game = this;
			
			// prepare datGui
			this.datGui = new dat.GUI();
			
			// prepare stats
			this.stats = new Stats();
			$("body").prepend(this.stats.domElement);
			env.loop.add(this.stats, this.stats.update);
		}
	});
	
	return Game;
});
