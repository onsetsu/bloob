mini.Module(
	"engine/rendering/texture"
)
.requires(
	"engine/rendering/texturemapping",
	"engine/rendering/image"
)
.defines(function(TextureMapping, Image) {

	var Texture = mini.Class.subclass({
		image: Image.get("sample.png"),
		initialize: function(/*image*/) {
			//this.image = image;
		},
		
		drawOn: function(body) {}
	});
	
	return Texture;
});
