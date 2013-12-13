mini.Module(
	"engine/rendering/texturemapping"
)
.requires(
	"engine/rendering/image"
)
.defines(function(Image) {
	var TextureMapping = mini.Class.subclass({
		initialize: function() {},
		
		from: function() {},
		to: function() {}
	});
	
	return TextureMapping;
});
