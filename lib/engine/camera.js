mini.Module(
	"engine/camera"
)
.requires(
	"engine/map/layer"
)
.defines(function(Layer) {
	var Camera = mini.Class.subclass({
		initialize: function(height, width) {
			this.layerStack = [];
			this.resetLayers();
			
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
				this.pushLayer(Camera.defaultLayer);
				this.pushLayer(this.trackedBodyLayer);
				var screenPoint = this.worldToScreenCoordinates(this.bodyToTrack.mDerivedPos);
				this.popLayer(); // tracked layer
				var worldPoint = this.screenToWorldCoordinates(screenPoint);
				this.jumpToPoint(worldPoint);
				this.popLayer(); // defaultLayer
			};
			
			// Update frame to print in renderer.
			this.jumpToPoint(this.point);
		},
	
		track: function(body, layer) {
			this.bodyToTrack = body;
			this.trackedBodyLayer = layer;
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
			// TODO: 
			var middlePoint = this.point
				.mulVector(this.currentLayer.scrollFactor)
				.divVector(Camera.defaultLayer.scrollFactor);
			var extend = new Jello.Vector2(this.width, this.height)
				// multiply inverse of scale to achieve intended behavior
				.mulVector(Jello.Vector2.One.divVector(this.currentLayer.scale))
				.divVector(Camera.defaultLayer.scale);
			this.scaleX.domain([
				middlePoint.x - extend.x / 2,
				middlePoint.x + extend.x / 2
			]);
			this.scaleY.domain([
				middlePoint.y - extend.y / 2,
				middlePoint.y + extend.y / 2
			]);
		},
		
		// Ranges are given in screen coordinates.
		resetScaleRange: function() {
			this.scaleX.range([0, env.canvas.canvasWidth]);
			this.scaleY.range([env.canvas.canvasHeight, 0]);
		},
		
		// Pushes a new Layer to the top of the Layer stack.
		pushLayer: function(layer) {
			//console.log("push");
			this.layerStack.push(layer);
			this.currentLayer = layer;
			
			this.updateScales();
		},
		
		// Removes the top Layer from stack.
		popLayer: function() {
			//console.log("pop");
			this.layerStack.pop();
			this.currentLayer = this.layerStack[this.layerStack.length-1];

			this.updateScales();
		},
		
		// (Re-)initialize stack with a default Layer.
		resetLayers: function() {
			// default layer
			this.currentLayer = Camera.defaultLayer;
			this.layerStack.length = 0;
			this.layerStack.push(this.currentLayer);
		}
	});
	
	Camera.defaultLayer = new Layer();
	
	return Camera;
});
