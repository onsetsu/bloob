mini.Module(
	"assets/resource"
)
.requires(
	"assets/loader"
)
.defines(function(Loader) {
	var Resource = mini.Class.subclass({
		initialize: function() {
			Loader.addResource(this);
		},
		load: function(callback) {
			
		}
	});
	
	return Resource;
});
