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
		}
	};
	
	return Loader;
});
