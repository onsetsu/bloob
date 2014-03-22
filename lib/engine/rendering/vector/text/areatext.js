define([
	"engine/rendering/vector/path"
], function() {
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
