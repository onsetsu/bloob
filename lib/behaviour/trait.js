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
			var onLoaded = function(specialTrait) {
				console.log(url, arguments);
				that.onUpdate(specialTrait);//Trait.Repository.get(that.path));
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
		
		// react to update
		onUpdate: function(callbackConstructor) {
			this.__callback = new callbackConstructor(this.additionalArgument);
			
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
