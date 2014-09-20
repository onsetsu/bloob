define([
	"engine/map/layer",
	"engine/view/viewport",
	"num/matrix3x3",
	"physics/jello"
], function(Layer, Viewport, AffineTransformation, Jello) {
	var Camera = mini.Class.subclass({
		initialize: function(viewport) {
			this.viewport = viewport;

            this.worldToScreenTransform = AffineTransformation.Identity.copy();
            this.screenToWorldTransform = AffineTransformation.Identity.copy();

			this.layerStack = [];
			this.resetLayers();
			
			// scaling
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

		screenToWorldCoordinates: function(vector) {
		    return this.screenToWorldTransform.transform(vector);
		},

		worldToScreenCoordinates: function(vector) {
		    return this.worldToScreenTransform.transform(vector);
		},
	
		jumpToPoint: function(vector) {
			this.viewport.point.set(vector);
			this.updateScales();
		},
	
		translateBy: function(vector) {
			this.viewport.point.addSelf(vector);
			this.updateScales();
		},

		// adjust viewport-related parameters
		updateScales: function() {
			this.updateTransform();
		},

		// adjust canvas/screen-related parameters
		// Ranges are given in screen coordinates.
		resetScaleRange: function() {
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
            this.worldToScreenTransform.set(transform);
            this.screenToWorldTransform.set(transform.inverted());
		},
		
		// Pushes a new Layer to the top of the Layer stack.
		pushLayer: function(layer) {
			this.layerStack.push(layer);
			this.currentLayer = layer;
			
			this.updateScales();
		},
		
		// Removes the top Layer from stack.
		popLayer: function() {
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
