mini.Module(
	"engine/rendering/animationsheet"
)
.requires(
	"engine/rendering/image"
)
.defines(function(Image) {
	var AnimationSheet = mini.Class.subclass({
		initialize: function(filePath, frameWidth, frameHeight) {
			console.log("SHEEEEEEEEEEEEEEEEEEEEEEEEEEEETTTTTT");
		},
		load: function() {
			
		}
	});
	
	return AnimationSheet;
});
