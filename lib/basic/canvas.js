define([
	"physics/jello"
], function(Jello) {
	var Canvas = mini.Class.subclass({
		initialize: function(canvasId, canvasHeight, canvasWidth, backgroundColor) {
			this.canvasId = canvasId || "engineCanvas";
			this.backgroundColor = backgroundColor || "black";
			
			if ($("canvas#" + this.canvasId).length > 0) {
				this.$element = $("canvas#" + this.canvasId);
			} else {
				this.$element = $("<canvas></canvas>")
					.attr("id", this.canvasId)
					.appendTo($("body"));
			}
			this.$element.css("background-color", this.backgroundColor);

			this.resize(new Jello.Vector2(
				canvasWidth || 1400,
				canvasHeight || 400
			));
			
			this.domElement = document.getElementById(this.canvasId);
		},
		resize: function(extent) {
			this.extent = extent;
			
			this.$element
				.attr("width", this.extent.x)
				.attr("height", this.extent.y);
		}
	});
	
	return Canvas;
});
