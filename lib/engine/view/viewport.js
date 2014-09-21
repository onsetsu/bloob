define(["num/matrix3x3", "physics/vector2"], function(AffineTransformation, Vector2) {
	var Viewport = mini.Class.subclass({
		initialize: function(middlePoint, extent) {
			this.point = middlePoint;
			this.extent = extent;
		},

		getTransformationForLayer: function(layer) {
            var invViewportTransformation = AffineTransformation.Identity.copy();
            invViewportTransformation.scaleSelf(layer.scale);
            invViewportTransformation.scaleSelf(Vector2.One.divVector(this.extent));
            invViewportTransformation.translateSelf(this.point.negative().mulVector(layer.scrollFactor));

            return invViewportTransformation.inverted();
		}
	});
	
	return Viewport;
});
