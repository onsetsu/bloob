mini.Module(
	"engine/rendering/renderer"
)
.requires(

)
.defines(function() {
	var Renderer = mini.Class.subclass({
		initialize: function() {
			this.canvasId = env.canvas.canvasId;
			this.canvas = env.canvas.domElement;
			this.context = this.canvas.getContext('2d');
		}
	});
	
	return Renderer;
});
