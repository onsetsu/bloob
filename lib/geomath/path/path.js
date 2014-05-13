define([
	"physics/jello",
	"geomath/path/waypoint",
	"geomath/path/curve"
], function(Jello, Segment, Curve) {
	var Path = mini.Class.subclass({
		// construct pathes
		initialize: function() {
			this.segments = [];
			this.curves = [];
			this.isClosed = false;
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
		
		closed: function() {
			return this.isClosed;
		},
		
		close: function(isClosed) {
			this.isClosed = isClosed;
			
			return this;
		},
		
		copy: function () {
		},
		
		/*
		 * construction helper
		 */
		get: function(index) {
			return this.segments[index];
		},
		
		getCurrentSegment: function() {
			return this.get(this.segments.length - 1);
		},
		
		add: function(segment) {
			this.segments.push(segment);
			
			return this;
		},
		
		remove: function(index) {
			this.segments.splice(index, 1);
			
			return this;
		},
		
		lineTo: function(vector) {
			this.add(new Segment(vector));
			
			return this;
		},
		
		// internal implementation using relative out- and inHandle and absolute to
		_cubicCurve: function(fromOutHandle, toInHandle, to) {
			this.getCurrentSegment().outHandle.set(fromOutHandle);
			this.add(new Segment(to, toInHandle, undefined));
			
			return this;
		},
		
		// all parameters are absolute points
		cubicCurveTo: function(fromOutHandle, toInHandle, to) {
			return this._cubicCurve(
				fromOutHandle.sub(this.getCurrentSegment().point),
				toInHandle.sub(to),
				to
			);
		},
		
		quadraticCurveTo: function(handle, to) {
			var current = this.getCurrentSegment().point;
			return this.cubicCurveTo(
				handle.add(current.sub(handle).divFloat(3)),
				handle.add(to.sub(handle).divFloat(3)),
				to
			);
		},
		
		curveTo: function(through, to, t) {
			var t1 = 1 - t;
			var current = this.getCurrentSegment().point;
			var handle = through
				.sub(current.mulFloat(t1 * t1))
				.sub(to.mulFloat(t * t))
				.divFloat(2 * t * t1);
			// TODO: check for handle.isNan
			return this.quadraticCurveTo(handle, to);
		},
		
		arcTo: function(vector) {
			return this;
		},
		
		lineBy: function(vector) {
			this.add(new Segment(vector.add(this.getCurrentSegment().point)));
			
			return this;
		},
		
		// all parameters are relative points (from current waypoint)
		cubicCurveBy: function(fromOutHandle, toInHandle, to) {
			return this._cubicCurve(
				fromOutHandle,
				toInHandle.sub(to),
				to.add(this.getCurrentSegment().point)
			);
		},
		
		// all parameters are relative points (from current waypoint)
		quadraticCurveBy: function(handle, to) {
			var current = this.getCurrentSegment().point;
			return this.quadraticCurveTo(current.add(handle), current.add(to));
		},
		
		curveBy: function(through, to, t) {
			var current = this.getCurrentSegment().point;
			return this.curveTo(current.add(through), current.add(to), t);
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
				if (path.closed() && length > 0)
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
