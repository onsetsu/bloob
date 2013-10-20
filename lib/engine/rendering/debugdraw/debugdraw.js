var DEBUG = function() {
	console.log(arguments);
};

mini.Module(
	"engine/rendering/debugdraw/debugdraw"
)
.requires(

)
.defines(function() {
	/*
	 * Init
	 */
	var DebugDraw = mini.Class.subclass({
		initialize: function(canvas, camera) {
			this.drawCallbacks = [];

			canvas = canvas || {};

			this.camera = camera;
			this.canvasId = canvas.canvasId;
			this.canvas = canvas.domElement;
			this.context = this.canvas.getContext('2d');
			//this.canvasWidth = canvas.canvasWidth;
			//this.canvasHeight = canvas.canvasHeight;
			
			this.setOptions();
		},

		/*
		 *  Configure which parts should be drawn.
		 */
		setObjectToDraw: function(callbackContext) {
			this.drawCallbacks.push(callbackContext);
			return this;
		},
	
		/*
		 * Drawing
		 */
		draw: function() {
			// clear canvas
			this.context.clearRect(
				0,
				0, 
				this.canvas.width,
				this.canvas.height
			);
			
			for(var index in this.drawCallbacks) {
				this.drawCallbacks[index].debugDraw(this);
			}
		},
	
		/*
		 * Graphical primitives
		 */
		drawRectangle: function(vec, size) {
			size = size || 2;
			this.context.fillRect(
				this.camera.scaleX(vec.x) - size / 2,
				this.camera.scaleY(vec.y) - size / 2,
				size,
				size
			);
		},
	
		drawDot: function(vec, size) {
			size = size || 2;
			this.context.arc(
				this.camera.scaleX(vec.x),
				this.camera.scaleY(vec.y),
				size, // radius
				0,
				2 * Math.PI,
				false
			);
			this.context.fill();
		},
	
		drawPolyline: function(vList) {
			// draw a polyline
			this.context.beginPath();
	
			this.context.moveTo(
				this.camera.scaleX(vList[0].x),
				this.camera.scaleY(vList[0].y)
			);
			for(var i = 1; i < vList.length; i++)
				this.context.lineTo(
					this.camera.scaleX(vList[i].x),
					this.camera.scaleY(vList[i].y)
				);
			this.context.lineTo(
				this.camera.scaleX(vList[0].x),
				this.camera.scaleY(vList[0].y)
			);
			this.context.stroke();
			
			this.context.closePath();
		},
	
		drawPlus: function(point, size) {
			size = size || 3;
			
			this.context.beginPath();
			
			// draw a polyline
			this.context.moveTo(
				this.camera.scaleX(point.x) - size,
				this.camera.scaleY(point.y)
			);
			this.context.lineTo(
				this.camera.scaleX(point.x) + size,
				this.camera.scaleY(point.y)
			);
			this.context.moveTo(
				this.camera.scaleX(point.x),
				this.camera.scaleY(point.y) - size
			);
			this.context.lineTo(
				this.camera.scaleX(point.x),
				this.camera.scaleY(point.y) + size
			);
	
			this.context.stroke();	
			this.context.closePath();
		},
	
		/*
		 * Configure Drawing
		 */
		setOptions: function(options) {	
			// set properties
			options = options || {};
			this.color = options.color || "white";
			this.opacity = options.opacity || 1.0;
			this.lineWidth = options.lineWidth || 1.0;
			
			// apply to context
			this.context.fillStyle = this.color;
			this.context.strokeStyle = this.color;
			this.context.globalAlpha = this.opacity;
			
			this.context.lineWidth = this.lineWidth;
		}
	});
	
	return DebugDraw;
});

