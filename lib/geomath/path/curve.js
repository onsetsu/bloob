define(["physics/jello"], function(Jello) {
	var Curve = mini.Class.subclass({
		initialize: function(segment1, segment2) {
			this.segment1 = segment1;
			this.segment2 = segment2;
		},
		
		draw: function() {
			env.renderer.setOptions({color: "lightgreen"});
			env.renderer.drawPolyline([this.segment1.point, this.segment2.point]);
		}
	});
	
	return Curve;
});
