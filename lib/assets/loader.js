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
		// Load all required resources, then call given callback.
		load: function(onFinished) {
			
			// If no resources have to be loaded, call given callback.
			if(Loader.resources.length == 0) {
				onFinished();
				return;
			};

			// Fetch current resources.
			var currentResources = [];
			for(var resourceIndex in Loader.resources) {
				currentResources.push(Loader.resources[resourceIndex]);
			};
			Loader.resources.length = 0;

			var numberOfResourcesToLoad = currentResources.length;
			var singleLoadingFinished = function() {
				numberOfResourcesToLoad--;
				if(numberOfResourcesToLoad == 0) onFinished();
			};
			
			for(var resourceIndex in currentResources) {
				currentResources[resourceIndex].load(function() {
					singleLoadingFinished();
				});
			};
		}
	};
	
	return Loader;
});
