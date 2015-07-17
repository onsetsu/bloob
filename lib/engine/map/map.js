define(function(require) { 'use strict';
  var Resource = require('assets/resource'),
      Input = require('engine/input/input'),
      Loader = require('assets/loader'),
      Utils = require('basic/utils'),
      Layer = require('engine/map/layer');

  // Repository of loaded json-maps
  var MapRepository = {};

  var Map = Resource.subclass({
    initialize: function(mapName) {
      if(typeof mapName !== 'undefined')
        Resource.prototype.initialize.apply(this, arguments);
      this.mapName = mapName || '';
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
            Map.fromJson(json, this);

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
      this.layers.forEach(function(layer) {
        layer.update();
      });
    },

    draw: function(renderer) {
      // draw each layer separately
      this.layers.forEach(function(layer) {
        layer.draw(renderer);
      });

      this.combineLayers(renderer);
    },

    combineLayers: function(renderer) {
      this.layers.forEach(function(layer) {
        if(layer.enabled) {
          renderer.drawLayer(layer);
        }
      });
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
      this.layers = Utils.Array.sort(this.layers, 'zIndex');
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
      this.layers.forEach(function(layer, index) {
        layer.initDatGui(mapFolder, index);
      });

      return this;
    }
  });

  Map.prototype.toJson = function(map) {
    var resultJson = {
      'name': this.mapName,
      'spawnPoints': {
        'default': {'x': 0, 'y': 0}
      },
      'layers': []
    };

    // Convert Layers to json.
    this.layers.forEach(function(layer) {
      resultJson.layers.push(layer.toJson());
    });

    return resultJson;
  };

  // TODO: move to JsonToMapConverter
  //add convenient method
  Map.fromJson = function(mapJson, map) {
    map = map || new Map();

    // convert layers
    mapJson.layers.forEach(function(layer) {
      map.layers.push(Layer.fromJson(layer));
    });

    return map;
  };

  return Map;
});
