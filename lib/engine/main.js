define([
	"engine/game",
	"engine/loop",
	"engine/time/time",
	"engine/time/timer",
	"basic/canvas",
	"engine/input",
	"engine/camera",
	"basic/audio/audio",
	"engine/rendering/combinedrenderer",
	"physics/jello",
	"engine/core/environment",
	"assets/loader",
	"engine/domready"
], function(
	Game,
	Loop,
	Time,
	Timer,
	Canvas,
	Input,
	Camera,
	Audio,
	CombinedRenderer,
	Jello,
	Environment,
	Loader,
	domReady
) {
	var main = function(game, canvas) {
		domReady(function() {
			env = {};
			
			// Configure and start the game loop.
			env.loop = new Loop().clear().start();
			
			// Add global time listener.
			env.time = new Time();
			env.loop.add(env.time, env.time.update);
			
			// Single point to update all Timers.
			env.loop.add(Timer, Timer.update);
			
			// Single point to update all Tweens.
			env.loop.add(createjs.Tween, createjs.Tween.tick);
			
			env.canvas = canvas;
			env.input = new Input(env.canvas.canvasId);

			// choose, which height is projected from top of canvas to its bottom
			var heightToProject = 40; // or use world boundings: this.getWorld().mWorldLimits.Max.y - this.getWorld().mWorldLimits.Min.y;
			var desiredExtent = env.canvas.extent
				.mulFloat(heightToProject)
				.divFloat(env.canvas.extent.y);
			env.camera = new Camera(desiredExtent);
			
			env.audio = new Audio();
			env.renderer = new CombinedRenderer();

			Loader.load(function() {
				new (game)();
			});
		});
	};
	
	return main;
});
