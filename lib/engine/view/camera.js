define([
    'require',
	"engine/map/layer",
	"engine/view/viewport",
	'num/num'
], function(require, Layer, Viewport, num) {
    var num = require("num/num");
    var AffineTransformation = num.AffineTransformation;
    var Vector2 = num.Vector2;

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
            var transform = env.canvas.transformation.copy();

            var viewportTransformation = this.viewport.getTransformationForLayer(layer).inverted();
            transform.concatenateSelf(viewportTransformation);

            // apply calculated transformation
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
