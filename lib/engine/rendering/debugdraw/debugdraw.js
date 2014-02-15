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
			return this.drawRectangleNEW(vec, size);
			
			size = size || 2;
			this.context.fillRect(
				env.camera.scaleX(vec.x) - size / 2,
				env.camera.scaleY(vec.y) - size / 2,
				size,
				size
			);
		},
	
		drawRectangleNEW: function(vec, size) {
			size = size || 2;
			this.context.fillRect(
				vec.x - this.singlePixelExtent.x * size / 2,
				vec.y - this.singlePixelExtent.y * size / 2,
				this.singlePixelExtent.x * size,
				this.singlePixelExtent.y * size
			);
		},
	
		drawDot: function(vec, size) {
			size = size || 2;
			this.context.beginPath();
			this.context.arc(
				env.camera.scaleX(vec.x),
				env.camera.scaleY(vec.y),
				size, // radius
				0,
				2 * Math.PI,
				false
			);
			this.context.closePath();
			this.context.fill();
		},
		
		drawPolyline: function(vList) {
			return this.drawPolylineTEST(vList);
			
			// draw a polyline
			this.context.beginPath();
	
			this.context.moveTo(
				env.camera.scaleX(vList[0].x),
				env.camera.scaleY(vList[0].y)
			);
			for(var i = 1; i < vList.length; i++)
				this.context.lineTo(
					env.camera.scaleX(vList[i].x),
					env.camera.scaleY(vList[i].y)
				);
			this.context.lineTo(
				env.camera.scaleX(vList[0].x),
				env.camera.scaleY(vList[0].y)
			);
			this.context.stroke();
			
			this.context.closePath();
		},
		
		drawPolylineTEST: function(vList) {
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
			size = size || 3;
			
			this.context.beginPath();
			
			// draw a polyline
			this.context.moveTo(
				env.camera.scaleX(point.x) - size,
				env.camera.scaleY(point.y)
			);
			this.context.lineTo(
				env.camera.scaleX(point.x) + size,
				env.camera.scaleY(point.y)
			);
			this.context.moveTo(
				env.camera.scaleX(point.x),
				env.camera.scaleY(point.y) - size
			);
			this.context.lineTo(
				env.camera.scaleX(point.x),
				env.camera.scaleY(point.y) + size
			);
	
			this.context.stroke();	
			this.context.closePath();
		},
	
		drawText: function(text, screenPoint) {
			this.context.fillText(
					text,
					screenPoint.x,
					screenPoint.y
				);
		},
	
		drawTextWorld: function(text, worldPoint) {
			this.context.fillText(
					text,
					env.camera.scaleX(worldPoint.x),
					env.camera.scaleY(worldPoint.y)
				);
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

