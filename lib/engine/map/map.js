mini.Module(
	"engine/map/map"
)
.requires(
	"engine/input",
	"assets/loader",
	"assets/converter/fromjson/jsontomapconverter",
	"basic/utils",
	"basic/shapebuilder",
	"logic/bodyenhancement",
	"engine/map/layer"
)
.defines(function(
	Input,
	Loader,
	JsonToMapConverter,
	Utils,
	ShapeBuilder,
	BodyEnhancement,
	Layer
) {
	// Repository of loaded json-maps
	var MapRepository = {};

	var Map = mini.Class.subclass({
		initialize: function() {
			this.callbacks = [];
			this.layers = [];
		},
		
		getWorld: function() {
			if(typeof this.layers[0].world === "undefined")
				throw new Error("no world found");
			
			return this.layers[0].world;
		},
	
		build: function(mapName, callback) {
			callback = callback || function() {};
			// TODO: look, if already fetched from server (implemented by assetmanager)
			// if so: convert json to map and call callbacks
			// load otherwise
			Loader.loadMap(
				mapName,
				Utils.bind(
					function(json) {
						// convert given json to map
						JsonToMapConverter.convertJsonToMap(json, this);
						
						// fire callback
						callback(this);
					},
					this
				)
			);
			
			return this;
		},
		
		update: function(timePassed) {
			for(var index in this.layers)
				this.layers[index].update(timePassed);
		},
		
		draw: function() {
			
		},
		
		debugDraw: function(debugDraw) {
			for(var index in this.layers)
				this.layers[index].debugDraw(debugDraw);
		},
		
		addLayer: function(layer) {
			this.layers.push(layer);
		},
		
		spawnPlayerAt: function(scene, datGui) {
			/*
			 *  controllable blob:
			 */
			var pb = Jello.BodyFactory.createBluePrint(Jello.PressureBody)
				.world(scene.getWorld())
				.shape(ShapeBuilder.Shapes.Ball)
				.pointMasses(1.0)
				.translate(new Jello.Vector2(-25, 15))
				.rotate(0)
				.scale(Jello.Vector2.One.copy().mulFloat(2.0))
				.isKinematic(false)
				.edgeSpringK(300.0)
				.edgeSpringDamp(20.0)
				.shapeSpringK(150.0)
				.shapeSpringDamp(1.0)
				.gasPressure(100.0)
				.build();
			
			var foo = datGui.add(pb, 'mGasAmount').name('gasPressure').min(0).max(5000).listen().step(1);
			
			pb.aName = "Player";
			var input = new Input(scene.renderer.canvasId);
			input.initKeyboard();
			input.bind(Input.KEY.LEFT_ARROW, "left");
			input.bind(Input.KEY.RIGHT_ARROW, "right");
			input.bind(Input.KEY.UP_ARROW, "up");
			input.bind(Input.KEY.DOWN_ARROW, "down");
			input.bind(Input.KEY.DOWN_ARROW, "compress");
	
			pb.withUpdate(function(x) {
				if(input.state("left")) {
					//this.addGlobalForce(this.mDerivedPos, new Jello.Vector2(-3, 0));
					this.addGlobalRotationForce(10);
				} else if(input.state("right")) {
					//this.addGlobalForce(this.mDerivedPos, new Jello.Vector2(3, 0));
					this.addGlobalRotationForce(-10);
				} else if(input.state("up")) {
					this.addGlobalForce(this.mDerivedPos, new Jello.Vector2(0, 3));
				} else if(input.state("down")) {
					this.addGlobalForce(this.mDerivedPos, new Jello.Vector2(0, -3));
				};
				if(input.pressed("compress")) {
					this.setGasPressure(this.getGasPressure() / 10);
					this.setShapeMatchingConstants(250, 5);
				} else if(input.released("compress")) {
					this.setGasPressure(this.getGasPressure() * 10);
					this.setShapeMatchingConstants(150, 1);
				};
				input.clearPressed();
			});
	
			// make blob sticky
			// new BodyEnhancement(pb).makeSticky(datGui);
	
			// track camera focus on blob
			scene.camera.track(pb);
		},
		
		initDatGui: function(datGui) {
			var mapFolder = datGui.addFolder('Map');
			mapFolder.open();
			for(var index in this.layers)
				this.layers[index].initDatGui(mapFolder, index);
			
			return this;
		},
		
		initMouseInteractionMap: function(mouse, camera, datGuiFolder) {
			for(var index in this.layers)
				mouse = this.layers[index].initMouseInteractionMap(mouse, camera, datGuiFolder);
			
			return mouse;
		},
		
		initMouseInteractionEditor: function(mouse, camera, datGuiFolder) {
			for(var index in this.layers)
				mouse = this.layers[index].initMouseInteractionEditor(mouse, camera, datGuiFolder);

			return mouse;
		}
	});

	// TODO: move to JsonToMapConverter
	//add convenient method
	Map.fromJson = function(mapJson, map) {
		map = map || new Map();

		return JsonToMapConverter.convertJsonToMap(mapJson, map);
	};
	
	return Map;
});
