define(["num/matrix3x3", "physics/vector2"], function(AffineTransformation, Vector2) {
	var Viewport = mini.Class.subclass({
		initialize: function(middlePoint, extent) {
			this.point = middlePoint;
			this.extent = extent;
		},

		getTransformationForLayer: function(layer) {
            var viewportTransformation = AffineTransformation.Identity.copy();
			// move the coordinate system's origin ti the current world camera point
            viewportTransformation.translateSelf(this.point.mulVector(layer.scrollFactor));
			// scale a 1 by 1 box into the current view
            viewportTransformation.scaleSelf(this.extent);
            // adjust to layers scale
            // TODO: should this just be scrollFactor?
            viewportTransformation.scaleSelf(Vector2.One.divVector(layer.scale));

            return viewportTransformation;
		}
	});
	
	return Viewport;
});
