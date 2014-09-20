define([
	"engine/map/layer",
	"engine/view/viewport",
	"num/matrix3x3",
	"physics/jello"
], function(Layer, Viewport, AffineTransformation, Jello) {
	var Camera = mini.Class.subclass({
		initialize: function(viewport) {
			this.viewport = viewport;
			
			this.layerStack = [];
			this.resetLayers();
			
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
				var screenPoint = this.worldToScreenCoordinates(this.bodyToTrack.getDerivedPosition());
				this.popLayer(); // tracked layer
				var worldPoint = this.screenToWorldCoordinates(screenPoint);
				this.jumpToPoint(worldPoint);
				this.popLayer(); // defaultLayer
			};
			
			// Update frame to print in renderer.
			this.jumpToPoint(this.viewport.point);
		},
	
		track: function(body, layer) {
			this.bodyToTrack = body;
			this.trackedBodyLayer = layer;
			return this;
		},

	    // TODO: use transform.inverse
		screenToWorldCoordinates: function(vector) {
		    return this.invTransform.transform(vector);
			return new Jello.Vector2(
				this.scaleX.invert(vector.x),
				this.scaleY.invert(vector.y)
			);
		},

	    // TODO: use transform
		worldToScreenCoordinates: function(vector) {
		    return this.transform.transform(vector);
			return new Jello.Vector2(
				this.scaleX(vector.x),
				this.scaleY(vector.y)
			);
		},
	
		jumpToPoint: function(vector) {
			this.viewport.point.set(vector);
			this.updateScales();
		},
	
		translateBy: function(vector) {
			this.viewport.point.addSelf(vector);
			this.updateScales();
		},
		
		updateScales: function() {
			var middlePoint = this.viewport.point
				.mulVector(this.currentLayer.scrollFactor)
				.divVector(Camera.defaultLayer.scrollFactor);
			var extend = this.viewport.extent
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
			this.updateTransform();
		},
		
		// Ranges are given in screen coordinates.
		resetScaleRange: function() {
			this.scaleX.range([0, env.canvas.extent.x]);
			this.scaleY.range([env.canvas.extent.y, 0]);
			this.updateTransform();
		},

		updateTransform: function() {
		    var layer = this.currentLayer;
            var transform = AffineTransformation.Identity.copy();
            transform.translateSelf(env.canvas.extent.divFloat(2));
            transform.scaleSelf(env.canvas.extent);
            transform.scaleSelf(new Jello.Vector2(1, -1));
            transform.scaleSelf(layer.scale);
            transform.scaleSelf(Jello.Vector2.One.divVector(this.viewport.extent));
            transform.translateSelf(this.viewport.point.negative().mulVector(layer.scrollFactor));
            this.transform = transform; // world/layer to canvas
            this.invTransform = transform.inverted();
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
