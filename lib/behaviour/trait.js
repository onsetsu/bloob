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
			var url = "lib/behaviour/traits/" + this.path + ".js";
			var onLoaded = function() {
				that.onUpdate(Trait.Repository.get(that.path));
                callback();
			};
/*			$.ajax({
				url: url,
				dataType: "script",
				success: function() {
					console.log("FOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
					that.onUpdate(Trait.Repository.get(that.path));
					callback();
				}
			});
*/
			var script = document.createElement("script")
		    script.type = "text/javascript";

		    if (script.readyState){  //IE
		        script.onreadystatechange = function(){
		            if (script.readyState == "loaded" ||
		                    script.readyState == "complete"){
		                script.onreadystatechange = null;
		                onLoaded();
		            }
		        };
		    } else {  //Others
		        script.onload = onLoaded;
		    }

		    script.src = url;
		    document.getElementsByTagName("head")[0].appendChild(script);
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
	
	Trait.Repository = Repository;
	
	Bloob.Trait = Trait;
	
	return Trait;
});
