mini.Module(
	"engine/rendering/vector/text/areatext"
)
.requires(
	"engine/rendering/vector/path"
)
.defines(function() {
	var AreaText = mini.Class.subclass({
		initialize: function(path, text) {
			this.path = path;
			this.text = text;
		},
		
		draw: function() {
		}
	});
	
	return AreaText;
});
