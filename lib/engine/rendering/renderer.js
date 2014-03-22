define([

], function() {
	var Renderer = mini.Class.subclass({
		initialize: function() {
			this.canvasId = env.canvas.canvasId;
			this.canvas = env.canvas.domElement;
			this.context = this.canvas.getContext('2d');
			
			this.drawCount = 0;
		},
		
		/*
		 * Drawing
		 */
		draw: function(objectToDraw) {
			this.drawCount = 0;
		}
	});
	
	return Renderer;
});
