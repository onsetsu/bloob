mini.Module(
	"engine/map/layer"
)
.requires(

)
.defines(function() {
	var Layer = mini.Class.subclass({
		initialize: function() {
			
		},
		update: function(timePassed) {
			
		},
		draw: function() {
			
		},
		debugDraw: function(debugDraw) {
			
		},
		initDatGui: function() {}
	});
	
	Layer.prototype.toJson = function() {
		return {};
	};
	Layer.fromJson = function(json) {
		return new Layer();
	};
	var LayerFromJson = Layer.fromJson;
	
	Layer.WorldLayer = Layer.subclass({
		setWorld: function(world) {
			this.world = world;
			
			return this;
		},
		update: function(timePassed) {
			Layer.prototype.update.apply(timePassed);
			
			if(typeof this.world !== "undefined")
				this.world.update(timePassed);
		},
		draw: function() {
			Layer.prototype.draw.apply();
			
		},
		debugDraw: function(debugDraw) {
			Layer.prototype.debugDraw.apply(debugDraw);
			
			if(typeof this.world !== "undefined")
				this.world.debugDraw(debugDraw);
		},
		initDatGui: function(mapFolder, index) {
			var layerFolder = mapFolder.addFolder('Layer' + index);
			layerFolder.open();
			layerFolder.add(this.world.materialManager.mMaterialPairs[Jello.Material.Default][Jello.Material.Default], 'Friction').name('Friction').min(-2).max(2).listen().step(0.1);
			layerFolder.add(this.world.materialManager.mMaterialPairs[Jello.Material.Default][Jello.Material.Default], 'Elasticity').name('Elasticity').min(-2).max(2).listen().step(0.1);
			layerFolder.add(Jello.World.gravitation, 'x').name('Gravitation_x').listen().min(-20).max(20).step(0.01);
			layerFolder.add(Jello.World.gravitation, 'y').name('Gravitation_y').listen().min(-20).max(20).step(0.01);
		}
	});

	// TODO: overwrite fromJson to include WorldLayer subclass
	Layer.WorldLayer.prototype.toJson = function() {
		return {
			world: this.world.toJson()
		};
	};
	
	Layer.fromJson = function(json) {
		if(typeof json.world === "undefined")
			return LayerFromJson(json);
		
		var world = new Jello.World();
		Jello.World.fromJson(json.world, world);
		var layer = new Layer.WorldLayer().setWorld(world);
		return layer;
	};

	return Layer;
});
