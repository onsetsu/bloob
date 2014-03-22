define([
	"assets/resource"
], function(Resource) {
	
	var Repository = {
		values: {},
		add: function(path, fn) {
			Repository.values[path] = fn;
		},
		get: function(path) {
			return Repository.values[path];
		}
	};
	
	var DrawCallback = Resource.subclass({
		initialize: function(filePath) {
			this.path = filePath;
			Resource.prototype.initialize.apply(this, arguments);
		},
		
		load: function(callback) {
			var that = this;
			var url = "engine/rendering/drawcallbacks/" + this.path;
			var onLoaded = function(drawcb) {
				that.onDraw(drawcb);
                callback();
			};
			
			// load via anonymous module
			var req = require.config({
				baseUrl: 'lib'
			});
			setTimeout(function() {
				req([url], onLoaded);
			}, 100);
		},

		// default callback does nothing
		__callback: function() {},
		
		// react to update
		onDraw: function(callback) {
			this.__callback = callback;
			
			return this;
		},
		
		draw: function(entity, renderer) {
			this.__callback.apply(this, arguments);
		}
	});
	
	DrawCallback.uid = 0;
	
	DrawCallback.prototype.toJson = function() {
		var json = {
			path: this.path
		};
		
		return json;
	};
	
	DrawCallback.fromJson = function(json) {
		var drawCallback = new DrawCallback(json.path);
		
		return drawCallback;
	};
	
	DrawCallback.Repository = Repository;
	
	return DrawCallback;
});
