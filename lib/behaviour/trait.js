mini.Module(
	"behaviour/trait"
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
	var Trait = mini.Class.subclass({
		initialize: function(callbackOrFileName) {
			if(typeof callbackOrFileName === "function")
				this.onUpdate(callbackOrFileName);
			else if(typeof callbackOrFileName === "string") {
				this.path = callbackOrFileName;
				Resource.prototype.initialize.apply(this, arguments);
			}
		},
		
		load: function(callback) {
			var that = this;
			var url = "behaviour/traits/" + this.path;
			var onLoaded = function() {
				that.onUpdate(Trait.Repository.get(that.path));
                callback();
			};
			
			// load via module
			mini.Module("anonymous_trait " + Trait.uid++ + " (" + this.path + ")")
				.requires(url)
				.defines(onLoaded);
		},

		// react to update
		__callback: function() {},
		onUpdate: function(callback) {
			this.__callback = callback;
			
			return this;
		},
		update: function(entity) {
			this.__callback.apply(this, arguments);
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
