mini.Module(
	"engine/rendering/vector/text/pointtext"
)
.requires(

)
.defines(function() {
	var PointText = mini.Class.subclass({
		initialize: function(vector, text) {
			this.point = vector;
			this.text = text;
		},
		
		draw: function() {
			// TODO: implement
		}
	});
	
	return PointText;
});
