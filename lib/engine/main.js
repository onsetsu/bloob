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
	var main = function(game, canvasId) {
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
			
			env.canvas = new Canvas({canvasId: canvasId});
			env.input = new Input(env.canvas.canvasId);

			var canvasExtent = new Jello.Vector2(env.canvas.canvasHeight, env.canvas.canvasWidth);
			// choose, which height is projected from top of canvas to its bottom
			var heightToProject = 40; // or use world boundings: this.getWorld().mWorldLimits.Max.y - this.getWorld().mWorldLimits.Min.y;
			var desiredHeight = heightToProject * env.canvas.canvasHeight / env.canvas.canvasHeight;
			var desiredWidth = heightToProject * env.canvas.canvasWidth / env.canvas.canvasHeight;
			var desiredExtent = new Jello.Vector2(desiredWidth, desiredHeight);
			env.camera = new Camera(canvasExtent, desiredExtent);
			
			env.audio = new Audio();
			env.renderer = new CombinedRenderer();

			Loader.load(function() {
				new (game)();
			});
		});
	};
	
	return main;
});
