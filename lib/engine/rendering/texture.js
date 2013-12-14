mini.Module(
	"engine/rendering/texture"
)
.requires(
	"engine/rendering/texturemapping",
	"engine/rendering/image"
)
.defines(function(TextureMapping, Image) {

	var Texture = mini.Class.subclass({
		initialize: function(imagePath) {
			this.image = Image.get(imagePath);
			this.mappings = [];
		},

		from: function(coordinates) {
			this.currentMapping = new TextureMapping(this.image).from(coordinates);
			
			return this;
		},

		to: function(indices) {
			this.currentMapping.to(indices);
			this.mappings.push(this.currentMapping);
			
			return this;
		},

		drawOn: function(body) {
			for(var index in this.mappings)
				this.mappings[index].drawOn(body, this.image);
		}
	});
	
	return Texture;
});
