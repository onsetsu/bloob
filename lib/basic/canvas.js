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
			this.backgroundColor = options.backgroundColor || "black";
			
			if ($("canvas#" + this.canvasId).length > 0) {
				this.$element = $("canvas#" + this.canvasId);
			} else {
				this.$element = $("<canvas></canvas>")
					.attr("id", this.canvasId)
					.appendTo($("body"));
			}
			this.$element.css("background-color", this.backgroundColor);

			this.resize(
				options.canvaswidth || 1400,
				options.canvasHeight || 400
			);
			
			this.domElement = document.getElementById(this.canvasId);
		},
		resize: function(width, height) {
			this.canvasHeight = height;
			this.canvasWidth = width;
			
			this.$element
				.attr("width", width)
				.attr("height", height);
		}
	});
	
	return Canvas;
});
