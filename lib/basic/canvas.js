define([
	"physics/jello"
], function(Jello) {
	var Canvas = mini.Class.subclass({
		initialize: function(canvasId) {
			this.canvasId = canvasId || "engineCanvas";
			this.extent = Jello.Vector2.Zero.copy();
			
			if ($("canvas#" + this.canvasId).length > 0) {
				this.$element = $("canvas#" + this.canvasId);
			} else {
				this.$element = $("<canvas></canvas>")
					.attr("id", this.canvasId)
					.appendTo($("body"));
			}

			this.setExtentXY(
				this.$element.width(),
				this.$element.height()
			);
			
			this.domElement = document.getElementById(this.canvasId);
		},
		
		resize: function(x, y) {
			this.setExtentXY(x, y);
			
			this.$element
				.attr("width", this.extent.x)
				.attr("height", this.extent.y);
			
			if(typeof env !== "undefined" && typeof env.camera !== "undefined")
				env.camera.resetScaleRange();
		},
		
		setExtent: function(newExtent) {
			this.extent.set(newExtent);
		},
		
		setExtentXY: function(x, y) {
			this.extent.set(new Jello.Vector2(x, y));
		},
		
		color: function(backgroundColor) {
			this.$element.css("background-color", backgroundColor);
			
			return this;
		},
		
		/*
		 * formatting methods
		 */
		
		// give the canvas a fixed size, independent of the window size
		fixedSize: function(width, height) {
			this.resize(width, height);
			
			return this;
		},
		
		// give the canvas a fixed ratio, it will fit into the window
		screenFit: function() {
			return this;
		},
		
		// stretches the canvas to the whole window
		stretch: function() {
			this.$element
				.css("position", "absolute")
				.css("top", "0px")
				.css("left", "0px");

			//$(window).off("resize", function() { 3 + 3; });
			$(window).resize(this.stretchOnResize.bind(this));
			
			this.stretchOnResize();
			
			return this;
		},
		
		stretchOnResize: function() {
		    this.resize($(window).width(), $(window).height());
		},
		
		// request a fullScreen for the canvas
		fullScreen: function() {
			return this;
		}
	});
	
	return Canvas;
});
