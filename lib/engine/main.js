mini.Module(
	"engine/main"
)
.requires(
	"engine/game",
	"engine/loop",
	"engine/core/environment",
	"engine/domready"
)
.defines(function(Game, Loop, Environment, domReady) {
	var main = function(game) {
		env = {};
		
		// Configure and start the game loop.
		env.loop = new Loop().clear().start();

		domReady(function() {
			new (game)();
		});
	};
	
	return main;
});
