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
		initialize: function() {
			this.drawCallbacks = [];

			this.canvasId = env.canvas.canvasId;
			this.canvas = env.canvas.domElement;
			this.context = this.canvas.getContext('2d');
			//this.canvasWidth = env.canvas.canvasWidth;
			//this.canvasHeight = env.canvas.canvasHeight;
			
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
				env.camera.scaleX(vec.x) - size / 2,
				env.camera.scaleY(vec.y) - size / 2,
				size,
				size
			);
		},
	
		drawDot: function(vec, size) {
			size = size || 2;
			this.context.arc(
				env.camera.scaleX(vec.x),
				env.camera.scaleY(vec.y),
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

