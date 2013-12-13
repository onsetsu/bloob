mini.Module(
	"engine/rendering/texturemapping"
)
.requires(
	"engine/rendering/image"
)
.defines(function(Image) {
	var TextureMapping = mini.Class.subclass({
		initialize: function(image) {
			this.image = image;
		},
		
		from: function(coordinates) {
			// TODO: calc image part
			this.coordinates = coordinates;

			return this;
		},
		
		to: function(indices) {
			this.indices = indices;
			
			return this;
		}
	});
	
	return TextureMapping;
});
