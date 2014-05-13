define([
	"physics/jello",
	"geomath/path/waypoint",
	"geomath/path/curve"
], function(Jello, Segment, Curve) {
	var Path = mini.Class.subclass({
		// construct pathes
		initialize: function(segments, isClosed) {
			this.isClosed = isClosed || false;
			this.setSegments(segments);
		},
		
		setSegments: function(segments) {
			this.segments = segments || [];
			this.curves = [];
			for(var i = 1; i < this.segments.length; i++) {
				this.curves.push(new Curve(this.segments[i-1], this.segments[i]));
			}
		},
		
		/*
		 * ease pathes
		 */
		smooth: function() {
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
		
		getIsClosed: function() {
			return this.isClosed;
		},
		
		setIsClosed: function(isClosed) {
			this.isClosed = isClosed;
			
			return this;
		},
		
		/*
		 * construction helper
		 */
		getCurrentSegment: function() {
			return this.segments[this.segments.length - 1];
		},
		
		add: function(segment) {
			this.segments.push(segment);
		},
		
		lineTo: function(vector) {
			this.add(new Segment(vector));
			
			return this;
		},
		
		cubicCurveTo: function(vector) {
			return this;
		},
		
		quadraticCurveTo: function(vector) {
			return this;
		},
		
		curveTo: function(vector) {
			return this;
		},
		
		arcTo: function(vector) {
			return this;
		},
		
		lineBy: function(vector) {
			return this;
		},
		
		cubicCurveBy: function(fromOutHandle, toInHandle, to) {
			var currentSegment = getCurrentSegment();
			var currentPoint = currentSegment.point;
			this.cubicCurveTo();
			return this;
		},
		
		quadraticCurveBy: function(vector) {
			return this;
		},
		
		curveBy: function(vector) {
			return this;
		},
		
		arcBy: function(vector) {
			return this;
		},
		
		/*
		 * drawing utilities
		 */
		draw: function() {
			for(var i = 0; i < this.segments.length; i++)
				this.segments[i].draw();
			for(var i = 0; i < this.curves.length; i++)
				this.curves[i].draw();
			
			// draw curves
			env.renderer.setOptions({color: "orange"});
			(function drawSegments(path, ctx) {
				var segments = path.segments,
					length = segments.length,
					first = true,
					cur = Jello.Vector2.Zero.copy(),
					prev = Jello.Vector2.Zero.copy(),
					inHandle = Jello.Vector2.Zero.copy(),
					outHandle = Jello.Vector2.Zero.copy();

				function drawSegment(i) {
					var segment = segments[i];
					cur.set(segment.point);
					if (first) {
						ctx.moveTo(cur.x, cur.y);
						first = false;
					} else {
						inHandle.set(cur);
						inHandle.addSelf(segment.inHandle);
						if (inHandle.x == cur.x && inHandle.y == cur.y && outHandle.x == prev.x && outHandle.y == prev.y) {
							ctx.lineTo(cur.x, cur.y);
						} else {
							ctx.bezierCurveTo(outHandle.x, outHandle.y, inHandle.x, inHandle.y, cur.x, cur.y);
						}
					}
					prev.set(cur);
					outHandle.set(prev);
					outHandle.addSelf(segment.outHandle);
				}

				ctx.beginPath();
				for (var i = 0; i < length; i++)
					drawSegment(i);
				if (path.getIsClosed() && length > 0)
					drawSegment(0);
				ctx.stroke();
				ctx.closePath();

			})(this, env.renderer.context);
		}
	});
	
	// Specialized primitive Constructors
	Path.Circle = function(point, radius) {};
	// ...
	
	Path.Segment = Segment;
	Path.Curve = Curve;
	
	return Path;
});
