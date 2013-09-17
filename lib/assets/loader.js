mini.Module(
	"assets/loader"
)
.requires(
	"assets/loadassembler"
)
.defines(function() {
	var Loader = {
		"loadMap": function(filePath, onSuccess) {
			Bloob.LoadAssembler.loadMap(filePath, onSuccess);
		}
	};
	
	Bloob.Loader = Loader;
	
	return Loader;
});
