var DEBUG = function() {
	console.log(arguments);
};

define([
	"engine/rendering/renderer",
	"physics/jello"
], function(Renderer, Jello) {
	var DebugDraw = Renderer.subclass({
		/*
		 * Init
		 */
		initialize: function() {
			Renderer.prototype.initialize.apply(this, arguments);
			
			// set default pixel extent to allow setOptions
			this.singlePixelExtent = new Jello.Vector2(1, 1);

			this.setOptions();
		},

		/*
		 * Handle Layers
		 */
		pushLayer: function(layer) {
			// create shortcuts
			var context = this.context;

			// save current context for later restoration
			context.save();

			// create transformation matrix (note the inverse order):
			// move the coordinate system's origin to the middle of the canvas
			this.context.translate(
				env.canvas.extent.x / 2,
				env.canvas.extent.y / 2
			);
			// rescale 1 by 1 box to canvas size
			this.context.scale(
				env.canvas.extent.x,
				env.canvas.extent.y
			);
			// invert y-axis
			this.context.scale(1, -1);
			// adjust to layers scale
			this.context.scale(
				layer.scale.x,
				layer.scale.y
			);
			// scale the current viem into a 1 by 1 box
			this.context.scale(
				1 / env.camera.viewport.extent.x,
				1 / env.camera.viewport.extent.y
			);
			// move current world camera point to the coordinate system's origin
			this.context.translate(
				-env.camera.viewport.point.x * layer.scrollFactor.x,
				-env.camera.viewport.point.y * layer.scrollFactor.y
			);
			
			this.singlePixelExtent = env.camera.screenToWorldCoordinates(new Jello.Vector2(1, 1)).sub(
				env.camera.screenToWorldCoordinates(new Jello.Vector2(0, 0))
			);
		},
		
		popLayer: function() {
			// restore saved context state to revert adding layer
			this.context.restore();
		},
	
		/*
		 * Drawing
		 */
		draw: function(objectToDraw) {
			Renderer.prototype.draw.apply(this, arguments);

			// clear canvas
			this.context.clearRect(
				0,
				0, 
				this.canvas.width,
				this.canvas.height
			);
			
			// Draw given object.
			objectToDraw.debugDraw(this);
		},
		
		// Update canvas aabb for filtering "out of screen" objects.
		updateCanvasWorldAABB: function() {
			var min = env.camera.screenToWorldCoordinates(new Jello.Vector2(0, env.canvas.extent.y));
			var max = env.camera.screenToWorldCoordinates(new Jello.Vector2(env.canvas.extent.x, 0));
			this.canvasWorldAABB = new Jello.AABB(min, max);
		},
	
		/*
		 * Graphical primitives
		 */
		drawRectangle: function(vec, size, color, opacity) {
			this.drawCount++;
			
			this.setFillStyle(color);
			this.setGlobalAlpha(opacity);
			
			size = size || 2;
			this.context.fillRect(
				vec.x - this.singlePixelExtent.x * size / 2,
				vec.y - this.singlePixelExtent.y * size / 2,
				this.singlePixelExtent.x * size,
				this.singlePixelExtent.y * size
			);
		},
	
		drawDot: function(vec, size) {
			this.drawCount++;
			
			size = size || 2;
			this.context.beginPath();
			this.context.arc(
				vec.x,
				vec.y,
				this.singlePixelExtent.x * size, // radius
				0,
				2 * Math.PI,
				false
			);
			this.context.closePath();
			this.context.fill();
		},
		
		drawLine: function(from, to, color, opacity, lineWidth) {
			this.drawCount++;
			
			this.setStrokeStyle(color);
			this.setGlobalAlpha(opacity);
			this.setLineWidth(lineWidth);

			// draw a line
			this.context.beginPath();
	
			this.context.moveTo(from.x, from.y);
			this.context.lineTo(to.x, to.y);
			
			this.context.stroke();
			
			this.context.closePath();
		},

		
		drawPolyline: function(vList) {
			this.drawCount++;
			
			// draw a polyline
			this.context.beginPath();
	
			this.context.moveTo(vList[0].x, vList[0].y);
			for(var i = 1; i < vList.length; i++)
				this.context.lineTo(vList[i].x, vList[i].y);
			this.context.lineTo(vList[0].x, vList[0].y);
			
			this.context.stroke();
			
			this.context.closePath();
		},

		drawPlus: function(point, size) {
			this.drawCount++;
			
			size = size || 3;
			
			this.context.beginPath();
			
			// draw a polyline
			this.context.moveTo(
				point.x - this.singlePixelExtent.x * size,
				point.y
			);
			this.context.lineTo(
				point.x + this.singlePixelExtent.x * size,
				point.y
			);
			this.context.moveTo(
				point.x,
				point.y - this.singlePixelExtent.y * size
			);
			this.context.lineTo(
				point.x,
				point.y + this.singlePixelExtent.y * size
			);
	
			this.context.stroke();	
			this.context.closePath();
		},

		drawTextWorld: function(text, worldPoint) {
			this.drawCount++;
			
			this.context.save();

			this.context.translate(
				worldPoint.x,
				worldPoint.y
			);
			this.context.scale(
				this.singlePixelExtent.x,
				this.singlePixelExtent.y
			);
			this.context.fillText(
				text,
				0,
				0
			);
			this.context.restore();
		},
	
		/*
		 * Configure Drawing
		 */
		setOptions: function(options) {	
			// apply properties to context
			options = options || {};
			
			this.setFillStyle(options.color);
			this.setStrokeStyle(options.color);
			this.setGlobalAlpha(options.opacity);
			this.setLineWidth(options.lineWidth);
		},
		
		setFillStyle: function(color) {
			this.color = color || "white";
			this.context.fillStyle = this.color;
		},
		
		setStrokeStyle: function(color) {
			this.color = color || "white";
			this.context.strokeStyle = this.color;
		},
		
		setGlobalAlpha: function(opacity) {
			this.opacity = opacity || 1.0;
			this.context.globalAlpha = this.opacity;
		},
		
		setLineWidth: function(lineWidth) {
			this.lineWidth = this.singlePixelExtent.x * (lineWidth || 1.0);
			this.context.lineWidth = this.lineWidth;
		},
		
		// Check for visibility
		isVisible: function(aabb) {
			//return true;
			return aabb.intersects(this.canvasWorldAABB);
		}

	});
	
	return DebugDraw;
});

