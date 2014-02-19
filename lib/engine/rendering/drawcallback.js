mini.Module(
	"engine/rendering/drawcallback"
)
.requires(
	"assets/resource"
)
.defines(function(Resource) {
	
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
			var onLoaded = function() {
				that.onUpdate(Trait.Repository.get(that.path));
                callback();
			};
			
			// load via anonymous module
			mini.Module("anonymous_drawcallback " + DrawCallback.uid++ + " (" + this.path + ")")
				.requires(url)
				.defines(onLoaded);
		},

		// default callback does nothing
		__callback: function() {},
		
		// react to update
		onUpdate: function(callback) {
			this.__callback = callback;
			
			return this;
		},
		
		update: function(entity) {
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
