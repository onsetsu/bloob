define([
	"physics/jello"
], function(Jello) {
	var Canvas = mini.Class.subclass({
		initialize: function(canvasId, canvasHeight, canvasWidth) {
			this.canvasId = canvasId || "engineCanvas";
			
			if ($("canvas#" + this.canvasId).length > 0) {
				this.$element = $("canvas#" + this.canvasId);
			} else {
				this.$element = $("<canvas></canvas>")
					.attr("id", this.canvasId)
					.appendTo($("body"));
			}

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
			
			return this;
		},
		
		color: function(backgroundColor) {
			this.$element.css("background-color", backgroundColor);
			
			return this;
		},
		
		// give the canvas a fixed size, independent of the window size
		fixedSize: function() {
			return this;
		},
		
		// give the canvas a fixed ratio, it will fit into the window
		screenFit: function() {
			return this;
		},
		
		// stretches the canves to the whole window
		stretch: function() {
			return this;
		},
		
		// request a fullScreen for the canvas
		fullScreen: function() {
			return this;
		}
	});
	
	return Canvas;
});
