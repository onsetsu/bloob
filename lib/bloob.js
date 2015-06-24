define([
    'require',
    'jello',
	"engine/core/bloob",
	"engine/game",
	"logic/teleport",
	"engine/input/input",
	"engine/view/canvas",
	"engine/scene/titlescene",
	"editor/server",
	"assets/loader",
	"debug/debug"
], function(
    require,
    Jello,
	Bloob,
	Game,
	Teleport,
	Input,
	Canvas,
	TitleScene,
	Server,
	Loader,
	Debug
) {
    var QuadTree = Jello.QuadTree,
        World = Jello.World;

	var BloobGame = Game.subclass({
		initialize: function() {
			Game.prototype.initialize.apply(this, arguments);
			
			this.testSave();
			this.testCanvas();
			this.testQuadTree();
			
			// prepare input
			env.input.initKeyboard();
			env.input.bind(Input.KEY.LEFT_ARROW, this.Left);
			env.input.bind(Input.KEY.RIGHT_ARROW, this.Right);
			env.input.bind(Input.KEY.UP_ARROW, this.Up);
			env.input.bind(Input.KEY.DOWN_ARROW, this.Down);

			env.input.bind(Input.KEY.M, "M");
			env.input.bind(Input.KEY.S, "S");
			env.input.bind(Input.KEY.D, "D");
			env.input.bind(Input.KEY.R, "R");

			// prepare input
			env.input.initMouse();
			env.input.bind(Input.KEY.MOUSE1, this.LeftButton);
			env.input.bind(Input.KEY.MOUSE2, this.RightButton);

			// TODO: make use of a preloaded title.json here to avoid the use of Loader
			var titleScene = new TitleScene();
			Loader.load(function() {
				env.sceneStack.run(titleScene);
			});
		},
		
		Left: "left",
		Right: "right",
		Up: "up",
		Down: "down",
		
		LeftButton: "leftclick",
		RightButton: "rightclick",

		testCanvas: function() {
			var testCanvas = {
				width: env.canvas.extent.x,
				height: env.canvas.extent.y,
				fixedSize: function() {
					env.canvas.fixedSize(testCanvas.width, testCanvas.height);
				},
				ratio: env.canvas.extent.x / env.canvas.extent.y,
				screenFit: function() {
					env.canvas.screenFit(testCanvas.ratio);
				}
			};
			if(Bloob.debug && Bloob.debug.datGui) {
				var canvasFolder = Bloob.debug.datGui.addFolder("Canvas");
				canvasFolder.open();
				canvasFolder.add(testCanvas, 'width');
				canvasFolder.add(testCanvas, 'height');
				canvasFolder.add(testCanvas, 'fixedSize');
				canvasFolder.add(testCanvas, 'ratio');
				canvasFolder.add(testCanvas, 'screenFit');
				canvasFolder.add(env.canvas, 'stretch');
				canvasFolder.add(env.canvas, 'fullScreen');
			}
		},

		testQuadTree: function() {
			if(Bloob.debug && Bloob.debug.datGui) {
				var quadTreeFolder = Bloob.debug.datGui.addFolder("QuadTree");
				quadTreeFolder.open();
				quadTreeFolder.add(QuadTree.Node, 'shouldDraw');
				quadTreeFolder.add(World, 'useQuadTree');
			}
		},

		testSave: function() {
			// test for map to json conversion
			var that = this;
			var toJson = {
				"save as": "untitled.json",
				"SAVE": function() {
					Bloob.log(env.sceneStack.top());
					Server.save(
						"data/maps/" + toJson["save as"],
						JSON.stringify(env.sceneStack.top().getMap().toJson(), undefined, 2)
					);
				}
			};
			if(Bloob.debug && Bloob.debug.datGui) {
				Bloob.debug.datGui.add(toJson, "save as");
				Bloob.debug.datGui.add(toJson, "SAVE");
			}
		}
	});
	
	return BloobGame;
});
