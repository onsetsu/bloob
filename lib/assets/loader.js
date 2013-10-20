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
		addResource: function(path) {
			
		},
		load: function(onFinished) {
			// TODO: load all required resources, then call callback
			onFinished();
		}
	};
	
	return Loader;
});
