mini.Module(
	"engine/game"
)
.requires(
	"engine/loop"
)
.defines(function(Loop) {
	var Game = mini.Class.subclass({
		initialize: function() {
			Bloob.log("NEW GAME");
			env.game = this;
		}
	});
	
	return Game;
});
