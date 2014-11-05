define(function(require) {
    var Vector2 = require("./../vector2");

	var Segment = mini.Class.subclass({
		initialize: function(point, inHandle, outHandle) {
			this.point = point;
			this.inHandle = inHandle || Vector2.Zero.copy();
			this.outHandle = outHandle || Vector2.Zero.copy();
		},
		
		setInHandle: function(vector) {
			this.inHandle.set(vector);
		},
		
		setOutHandle: function(vector) {
			this.outHandle.set(vector);
		},

		reverse: function() {
			return new Segment(this.point, this.outHandle, this.inHandle);
		},
		
		draw: function() {
			var inHandlePoint = this.point.add(this.inHandle);
			var outHandlePoint = this.point.add(this.outHandle);
			var color = "lightblue";
			var opacity = 1.0;
			var lineWidth = 1;
			
			env.renderer.drawRectangle(this.point, 3, color, opacity);
			env.renderer.drawRectangle(inHandlePoint, 3, color, opacity);
			env.renderer.drawRectangle(outHandlePoint, 3, color, opacity);
			env.renderer.drawLine(inHandlePoint, this.point, color, opacity, lineWidth);
			env.renderer.drawLine(this.point, outHandlePoint, color, opacity, lineWidth);
		}
	});
	
	return Segment;
});
