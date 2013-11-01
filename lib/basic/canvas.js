mini.Module(
	"basic/canvas"
)
.requires(

)
.defines(function() {
	var Canvas = mini.Class.subclass({
		initialize: function(options) {
			options = options || {};
			this.canvasId = options.canvasId || "engineCanvas";
			this.canvasHeight = options.canvasHeight || 400;
			this.canvasWidth = options.canvaswidth || 1400;
			this.backgroundColor = options.backgroundColor || "black";
			
			if ($("canvas#" + this.canvasId).length > 0) {
				this.$element = $("canvas#" + this.canvasId);
			} else {
				this.$element = $("<canvas></canvas>")
					.attr("id", this.canvasId)
					.appendTo($("body"));
			}
			this.$element
				.attr("width", this.canvasWidth)
				.attr("height", this.canvasHeight)
				.css("background-color", this.backgroundColor);

			this.domElement = document.getElementById(this.canvasId);
		}
	});
	
	return Canvas;
});
