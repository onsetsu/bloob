mini.Module(
	"engine/camera"
)
.requires(

)
.defines(function() {
	var Camera = mini.Class.subclass({
		initialize: function(height, width) {
			this.ratio = env.canvas.canvasWidth / env.canvas.canvasHeight;
			this.height = height;
			// if no width is given, use ratio of canvas
			this.width = width || this.ratio * this.height;
			this.point = Jello.Vector2.Zero.copy();
			console.log(this);
			this.canvasId = env.canvas.canvasId;
			
			// scaling
			this.scaleX = d3.scale.linear();
			this.scaleY = d3.scale.linear();
			this.resetScaleRange();
			
			this.update();
		},
	
		update: function() {
			if(typeof this.bodyToTrack !== "undefined") {
				var direction = this.bodyToTrack.mDerivedPos.sub(this.point);
				var dist = direction.length();
				if(dist > 5)
					this.point.addSelf(direction.mulFloat(
						0.03 * (dist - 5)
					));
			};
			
			// Update frame to print in renderer.
			this.jumpToPoint(this.point);
		},
	
		track: function(body) {
			this.bodyToTrack = body;
			return this;
		},
	
		screenToWorldCoordinates: function(vector) {
			return new Jello.Vector2(
				this.scaleX.invert(vector.x),
				this.scaleY.invert(vector.y)
			);
		},
	
		worldToScreenCoordinates: function(vector) {
			return new Jello.Vector2(
				this.scaleX(vector.x),
				this.scaleY(vector.y)
			);
		},
	
		jumpToPoint: function(vector) {
			this.point.set(vector);
			this.updateScales();
		},
	
		translateBy: function(vector) {
			this.point.addSelf(vector);
			this.updateScales();
		},
		
		updateScales: function() {
			this.scaleX.domain([
				this.point.x - this.width / 2,
				this.point.x + this.width / 2
			]);
			this.scaleY.domain([
				this.point.y - this.height / 2,
				this.point.y + this.height / 2
			]);
		},
		
		// Ranges are given in screen coordinates.
		resetScaleRange: function() {
			this.scaleX.range([0, env.canvas.canvasWidth]);
			this.scaleY.range([env.canvas.canvasHeight, 0]);
		}
	});
	
	return Camera;
});
