var DEBUG = function() {
	console.log(arguments);
};

mini.Module(
	"engine/rendering/debugdraw/debugdraw"
)
.requires(
	"engine/rendering/renderer"
)
.defines(function(Renderer) {
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
				env.canvas.canvasWidth / 2,
				env.canvas.canvasHeight / 2
			);
			// rescale 1 by 1 box to canvas size
			this.context.scale(
				env.canvas.canvasWidth,
				env.canvas.canvasHeight
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
				1 / env.camera.width,
				1 / env.camera.height
			);
			// move current world camera point to the coordinate system's origin
			this.context.translate(
				-env.camera.point.x * layer.scrollFactor.x,
				-env.camera.point.y * layer.scrollFactor.y
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
			var min = env.camera.screenToWorldCoordinates(new Jello.Vector2(0, env.canvas.canvasHeight));
			var max = env.camera.screenToWorldCoordinates(new Jello.Vector2(env.canvas.canvasWidth, 0));
			this.canvasWorldAABB = new Jello.AABB(min, max);
		},
	
		/*
		 * Graphical primitives
		 */
		drawRectangle: function(vec, size) {
			this.drawCount++;
			
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
			// set properties
			options = options || {};
			this.color = options.color || "white";
			this.opacity = options.opacity || 1.0;
			this.lineWidth = this.singlePixelExtent.x * (options.lineWidth || 1.0);
			
			// apply to context
			this.context.fillStyle = this.color;
			this.context.strokeStyle = this.color;
			this.context.globalAlpha = this.opacity;
			
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

