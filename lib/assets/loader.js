mini.Module(
	"assets/loader"
)
.requires(
	"assets/loadassembler"
)
.defines(function(LoadAssembler) {
	var Loader = {
		loadMap: function(filePath, onSuccess) {
			LoadAssembler.loadMap(filePath, onSuccess);
		},
		resources: [],
		addResource: function(path) {
			Loader.resources.push(path);
		},
		load: function(onFinished) {
			// TODO: load all required resources, then call callback
			if(Loader.resources.length == 0) {
				onFinished();
				return;
			};
			console.log("START LOADING", Loader.resources.length);

			var numberOfLoadedResources = Loader.resources.length;
			var singleLoadingFinished = function() {
				numberOfLoadedResources--;
				if(numberOfLoadedResources == 0) onFinished();
			};
			
			for(var resourceIndex in Loader.resources) {
				Loader.resources[resourceIndex].load(function() {
					console.log("LOADED");
					singleLoadingFinished();
				});
			};
		}
	};
	
	return Loader;
});
