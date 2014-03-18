mini.Module(
	"engine/rendering/vector/text/pathtext"
)
.requires(
	"engine/rendering/vector/path"
)
.defines(function() {
	var PathText = mini.Class.subclass({
		initialize: function(path, text) {
			this.path = path;
			this.text = text;
		},
		
		draw: function() {
		}
	});
	
	return PathText;
});
