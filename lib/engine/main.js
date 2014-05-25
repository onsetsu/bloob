define([
	"engine/game",
	"engine/loop",
	"engine/time/time",
	"engine/time/timer",
	"basic/canvas",
	"engine/input",
	"engine/camera",
	"engine/viewport",
	"basic/audio/audio",
	"engine/rendering/combinedrenderer",
	"physics/jello",
	"engine/map/map",
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
	Viewport,
	Audio,
	CombinedRenderer,
	Jello,
	Map,
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

			// choose, which subset of the world should be displayed
			var viewport = new Viewport(
				Jello.Vector2.Zero.copy(),
				new Jello.Vector2(100, 40)
			);
			env.camera = new Camera(viewport);
			
			env.audio = new Audio();
			env.renderer = new CombinedRenderer();

			// TODO: preload title and transition maps
			new Map("title");
			new Map("transition");
			
			Loader.load(function() {
				new (game)();
			});
		});
	};
	
	return main;
});
