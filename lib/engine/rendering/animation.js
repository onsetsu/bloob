mini.Module(
	"engine/rendering/animation"
)
.requires(
	"engine/rendering/animationsheet"
)
.defines(function(AnimationSheet) {
	var Animation = mini.Class.subclass({
		initialize: function() {
			console.log("ANIMATIIIIIIIIIIOOOOOOOOOOON");
		},
		load: function() {
			
		}
	});
	
	return Animation;
});
