mini.Module(
	"basic/canvas"
)
.requires(
	"rendering/debugdraw/debugdraw"
)
.defines(function() {
	var Canvas = mini.Class.subclass({
		initialize: function(options) {
			options = options || {};
			this.canvasId = options.canvasId || "engineCanvas";
			this.canvasHeight = options.canvasHeight || 400;
			this.canvasWidth = options.canvaswidth || 1400;
			this.backgroundColor = options.backgroundColor || "black";
			
			this.$element = $("<canvas id='" + this.canvasId + "' width='" + this.canvasWidth + "' height='" + this.canvasHeight + "'></canvas>")
				.appendTo($("body"))
				.css("background-color", this.backgroundColor);
			
			this.domElement = document.getElementById(this.canvasId);
		}
	});
	
	return Canvas;
});
