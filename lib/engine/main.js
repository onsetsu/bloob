mini.Module(
	"engine/main"
)
.requires(
	"engine/game",
	"engine/loop",
	"basic/canvas",
	"engine/input",
	"engine/camera",
	"basic/audio/audio",
	"engine/rendering/debugdraw/debugdraw",
	"engine/core/environment",
	"assets/loader",
	"engine/domready"
)
.defines(function(
	Game,
	Loop,
	Canvas,
	Input,
	Camera,
	Audio,
	DebugDraw,
	Environment,
	Loader,
	domReady
) {
	var main = function(game) {
		domReady(function() {
			env = {};
			
			// Configure and start the game loop.
			env.loop = new Loop().clear().start();
			env.canvas = new Canvas({canvasId: "bloobCanvas"});
			env.input = new Input(env.canvas.canvasId);

			// choose, which height is projected from top of canvas to its bottom
			var heightToProject = 40; // or use world boundings: this.getWorld().mWorldLimits.Max.y - this.getWorld().mWorldLimits.Min.y;
			var desiredHeight = heightToProject * env.canvas.canvasHeight / env.canvas.canvasHeight;
			var desiredWidth = heightToProject * env.canvas.canvasWidth / env.canvas.canvasHeight;
			env.camera = new Camera(
				desiredHeight,
				desiredWidth
			);
			
			env.audio = new Audio();
			env.renderer = new DebugDraw();

			Loader.load(function() {
				new (game)();
			});
		});
	};
	
	return main;
});
