define(["physics/jello"], function(Jello) {
	var Segment = mini.Class.subclass({
		initialize: function(point, inHandle, outHandle) {
			this.point = point;
			this.inHandle = inHandle || Jello.Vector2.Zero.copy();
			this.outHandle = outHandle || Jello.Vector2.Zero.copy();
		},
		
		setInHandle: function(vector) {
			
		},
		
		setOutHandle: function(vector) {
			
		},

		reverse: function() {
			return new Segment(this.point, this.outHandle, this.inHandle);
		},
		
		draw: function() {
			var inHandlePoint = this.point.add(this.inHandle);
			var outHandlePoint = this.point.add(this.outHandle);
			env.renderer.setOptions({color: "lightblue"});
			env.renderer.drawRectangle(this.point, 3);
			env.renderer.drawRectangle(inHandlePoint, 3);
			env.renderer.drawRectangle(outHandlePoint, 3);
			env.renderer.drawPolyline([inHandlePoint, this.point]);
			env.renderer.drawPolyline([this.point, outHandlePoint]);
		}
	});
	
	return Segment;
});
