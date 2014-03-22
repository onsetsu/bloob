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
	
	var Trait = Resource.subclass({
		initialize: function(filePath, additionalArgument) {
			this.path = filePath;
			this.additionalArgument = additionalArgument;
			Resource.prototype.initialize.apply(this, arguments);
		},
		
		load: function(callback) {
			var that = this;
			var url = "behaviour/traits/" + this.path;
			var onLoaded = function() {
				that.onUpdate(Trait.Repository.get(that.path));
                callback();
			};
			
			// load via anonymous module
			mini.Module("anonymous_trait " + Trait.uid++ + " (" + this.path + ")")
				.requires(url)
				.defines(onLoaded);
		},
		
		// react to update
		onUpdate: function(callback) {
			this.__callback = new callback(this.additionalArgument);
			
			return this;
		},
		
		update: function(entity) {
			if(this.__callback)
				this.__callback.update.apply(this.__callback, arguments);
		}
	});
	
	Trait.uid = 0;
	
	Trait.prototype.toJson = function() {
		var json = {
			path: this.path
		};
		
		return json;
	};
	
	Trait.fromJson = function(json) {
		var trait = new Trait(json.path);
		
		return trait;
	};
	
	Trait.Repository = Repository;
	
	return Trait;
});
