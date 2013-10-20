mini.Module(
	"engine/main"
)
.requires(
	"engine/game",
	"engine/loop",
	"basic/canvas",
	"engine/input",
	"engine/core/environment",
	"engine/domready"
)
.defines(function(Game, Loop, Canvas, Input, Environment, domReady) {
	var main = function(game) {
		domReady(function() {
			env = {};
			
			// Configure and start the game loop.
			env.loop = new Loop().clear().start();
			env.canvas = new Canvas({canvasId: "bloobCanvas"});
			env.input = new Input(env.canvas.canvasId);

			new (game)();
		});
	};
	
	return main;
});
