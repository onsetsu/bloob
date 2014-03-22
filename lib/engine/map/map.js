define([
	"assets/resource",
	"engine/input",
	"assets/loader",
	"assets/converter/fromjson/jsontomapconverter",
	"basic/utils",
	"engine/map/layer"
], function(
	Resource,
	Input,
	Loader,
	JsonToMapConverter,
	Utils,
	Layer
) {
	// Repository of loaded json-maps
	var MapRepository = {};

	var Map = Resource.subclass({
		initialize: function(mapName) {
			if(typeof mapName !== "undefined")
				Resource.prototype.initialize.apply(this, arguments);
			this.mapName = mapName || "";
			this.callbacks = [];
			this.layers = [];
		},
		
		load: function(callback) {
			callback = callback || function() {};
			// TODO: look, if already fetched from server (implemented by assetmanager)
			// if so: convert json to map and call callbacks
			// load otherwise
			Loader.loadMap(
				this.mapName,
				Utils.Function.bind(
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
		
		update: function() {
			this.sortLayers();
			for(var index in this.layers) {
				if(!this.layers.hasOwnProperty(index)) continue;

				this.layers[index].update();
			}
		},
		
		draw: function(renderer) {
			for(var index in this.layers) {
				if(!this.layers.hasOwnProperty(index)) continue;

				this.layers[index].draw(renderer);
			}
			
		},
		
		debugDraw: function(debugDraw) {
			for(var index in this.layers) {
				if(!this.layers.hasOwnProperty(index)) continue;

				this.layers[index].debugDraw(debugDraw);
			}
		},
		
		// -------------------------------------------------------------------------
		// Layers

		addLayer: function(layer) {
			this.layers.push(layer);
		},
		
		getLayers: function() {
			return this.layers;
		},
		
		sortLayers: function() {
			this.layers = Utils.Array.sort(this.layers, "zIndex");
		},
		
		removeLayerByName: function( name ) {
			for( var i = 0; i < this.layers.length; i++ ) {
				if( this.layers[i].name == name ) {
					this.layers.splice( i, 1 );
					return true;
				}
			}
			return false;
		},
		
		// -------------------------------------------------------------------------
		// Interactions

		initDatGui: function(datGui) {
			if(!Bloob.debug || !Bloob.debug.datGui) return;
			
			var mapFolder = datGui.addFolder('Map');
			mapFolder.open();
			for(var index in this.layers) {
				if(!this.layers.hasOwnProperty(index)) continue;

				this.layers[index].initDatGui(mapFolder, index);
			}
			
			return this;
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
