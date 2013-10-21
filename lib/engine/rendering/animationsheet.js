mini.Module(
	"engine/rendering/animationsheet"
)
.requires(
	"engine/rendering/image"
)
.defines(function(Image) {
	var AnimationSheet = mini.Class.subclass({
		initialize: function(path, frameWidth, frameHeight) {
			this.image = Image.get(path);
		},
		load: function() {
			
		}
	});
	
	return AnimationSheet;
});
