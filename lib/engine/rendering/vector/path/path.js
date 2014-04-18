define([], function() {
	var kappa = 0.5522847498307936;

	var Segment = mini.Class.subclass({
		initialize: function(point, inHandle, outHandle) {
			this.point = point;
			this.inHandle = inHandle || point.copy();
			this.outHandle = outHandle || point.copy();
		},

		reverse: function() {
			return new Segment(this.point, this.outHandle, this.inHandle);
		},
		
		draw: function() {
			env.renderer.drawRectangle(this.point, 2);
			env.renderer.drawRectangle(this.inHandle, 2);
			env.renderer.drawRectangle(this.outHandle, 2);
			env.renderer.drawPolyline([this.inHandle, this.point]);
			env.renderer.drawPolyline([this.point, this.outHandle]);
		}
	});
	
	var Curve = mini.Class.subclass({
		initialize: function(segment1, segment2) {
			this.segment1 = segment1;
			this.segment2 = segment2;
		},
		
		draw: function() {
			
		}
	});
	
	var Path = mini.Class.subclass({
		// construct pathes
		initialize: function(segments, isClosed) {
			this.segments = segments || [];
			this.isClosed = isClosed || false;
		},
		
		add: function(vector) {
			this.segments.push(vector);
		},
		
		// ease pathes
		smooth: function(vector) {
		},
		
		simplify: function(tolerance) {
		},
		
		flatten: function(maxDistance) {
		},
		
		// tests for overlapping pathes
		contains: function(path) {
		},
		
		intersects: function(path) {
		},
		
		getIntersections: function(path) {
		},
		
		// create new pathes by combining 2 overlapping ones
		intersect: function(path) {
		},
		
		unite: function(path) {
		},
		
		exclude: function(path) {
		},
		
		// drawing utilities
		draw: function() {
			for(var i = 0; i < this.segments.length; i++)
				this.segments[i].draw();
		}
	});
	
	// Specialized primitive Constructors
	Path.Circle = function() {};
	
	Path.Segment = Segment;
	Path.Curve = Curve;
	
	return Path;
});
