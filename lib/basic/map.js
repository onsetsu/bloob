mini.Module(
	"basic/map"
)
.requires(
	"basic/canvas",
	"engine/input",
	"assets/loader",
	"assets/converter/fromjson/jsontomapconverter",
	"basic/utils",
	"basic/shapebuilder",
	"logic/entity"
)
.defines(function(
	Canvas,
	Input,
	Loader,
	JsonToMapConverter,
	Utils,
	ShapeBuilder,
	Entity
) {
	// Repository of loaded json-maps
	var MapRepository = {};

	var Map = function() {
		this.world = new Jello.World();
		
		this.callbacks = [];
	};

	Map.prototype.onBuildFinished = function(callback) {
		this.callbacks.push(callback);
		return this;
	};

	Map.prototype.build = function(mapName) {
		// TODO: look, if already fetched from server (implemented by assetmanager)
		// if so: convert json to map and call callbacks
		// load otherwise
		Loader.loadMap(mapName, Utils.bind(this.loadingFinished, this));
		return this;
	};

	Map.prototype.loadingFinished = function(json) {
		// convert given json to map
		JsonToMapConverter.convertJsonToMap(json, this);
		
		// fire callbacks
		for(var index in this.callbacks) {
			this.callbacks[index](this);
		};
	};

	// TODO: move to JsonToMapConverter
	//add convenient method
	Map.fromJson = function(mapJson, map) {
		return JsonToMapConverter.convertJsonToMap(mapJson, map);
	};
	
	Map.prototype.spawnPlayerAt = function(scene, datGui) {
		/*
		 *  controllable blob:
		 */
		var pb = Jello.BodyFactory.createBluePrint(Jello.PressureBody)
			.world(scene.world)
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
		// new Entity(pb).makeSticky(datGui);

		// track camera focus on blob
		scene.camera.track(pb);
	};

	Map.prototype.initDatGui = function(datGui) {
		var obj = {
			"fn": function() {console.log("hallo");}
		};
		
		var mapFolder = datGui.addFolder('Map');
		mapFolder.open();
		mapFolder.add(this.world.materialManager.mMaterialPairs[Jello.Material.Default][Jello.Material.Default], 'Friction').name('Friction').min(-2).max(2).listen().step(0.1);
		mapFolder.add(this.world.materialManager.mMaterialPairs[Jello.Material.Default][Jello.Material.Default], 'Elasticity').name('Elasticity').min(-2).max(2).listen().step(0.1);
		mapFolder.add(Jello.World.gravitation, 'x').name('Gravitation_x').listen().min(-20).max(20).step(0.01);
		mapFolder.add(Jello.World.gravitation, 'y').name('Gravitation_y').listen().min(-20).max(20).step(0.01);
		mapFolder.add(obj, "fn").name('new Object');
		
		return this;
	};
	
	return Map;
});
