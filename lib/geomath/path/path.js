define([
	"physics/jello",
	"geomath/path/waypoint",
	"geomath/path/curve",
	"geomath/path/pathfitter",
	"geomath/path/pathflattener"
], function(Jello, Segment, Curve, PathFitter, PathFlattener) {
	function getFirstControlPoints(rhs) {
		var n = rhs.length,
			x = [], 
			tmp = [], 
			b = 2;
		x[0] = rhs[0] / b;
		for (var i = 1; i < n; i++) {
			tmp[i] = 1 / b;
			b = (i < n - 1 ? 4 : 2) - tmp[i];
			x[i] = (rhs[i] - x[i - 1]) / b;
		}
		for (var i = 1; i < n; i++) {
			x[n - i - 1] -= tmp[n - i] * x[n - i];
		}
		return x;
	}

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
			var segments = this.segments,
				size = segments.length,
				closed = this.isClosed,
				n = size,
				overlap = 0;
			if (size <= 2)
				return;
			if (closed) {
				overlap = Math.min(size, 4);
				n += Math.min(size, overlap) * 2;
			}
			var knots = [];
			for (var i = 0; i < size; i++)
				knots[i + overlap] = segments[i].point;
			if (closed) {
				for (var i = 0; i < overlap; i++) {
					knots[i] = segments[i + size - overlap].point;
					knots[i + size + overlap] = segments[i].point;
				}
			} else {
				n--;
			}
			var rhs = [];
	
			for (var i = 1; i < n - 1; i++)
				rhs[i] = 4 * knots[i].x + 2 * knots[i + 1].x;
			rhs[0] = knots[0].x + 2 * knots[1].x;
			rhs[n - 1] = 3 * knots[n - 1].x;
			var x = getFirstControlPoints(rhs);
	
			for (var i = 1; i < n - 1; i++)
				rhs[i] = 4 * knots[i].y + 2 * knots[i + 1].y;
			rhs[0] = knots[0].y + 2 * knots[1].y;
			rhs[n - 1] = 3 * knots[n - 1].y;
			var y = getFirstControlPoints(rhs);
	
			if (closed) {
				for (var i = 0, j = size; i < overlap; i++, j++) {
					var f1 = i / overlap,
						f2 = 1 - f1,
						ie = i + overlap,
						je = j + overlap;
					x[j] = x[i] * f1 + x[j] * f2;
					y[j] = y[i] * f1 + y[j] * f2;
					x[je] = x[ie] * f2 + x[je] * f1;
					y[je] = y[ie] * f2 + y[je] * f1;
				}
				n--;
			}
			var handleIn = null;
			for (var i = overlap; i <= n - overlap; i++) {
				var segment = segments[i - overlap];
				if (handleIn)
					segment.setInHandle(handleIn.sub(segment.point));
				if (i < n) {
					segment.setOutHandle(
							new Jello.Vector2(x[i], y[i]).sub(segment.point));
					handleIn = i < n - 1
							? new Jello.Vector2(
								2 * knots[i + 1].x - x[i + 1],
								2 * knots[i + 1].y - y[i + 1])
							: new Jello.Vector2(
								(knots[n].x + x[n - 1]) / 2,
								(knots[n].y + y[n - 1]) / 2);
				}
			}
			if (closed && handleIn) {
				var segment = this.segments[0];
				segment.setInHandle(handleIn.sub(segment.point));
			}
			return this;
		},
		
		simplify: function(tolerance) {
			if (this.segments.length > 2) {
				var fitter = new PathFitter(this, tolerance || 2.5);
				this.setSegments(fitter.fit());
			}
			return this;
		},
		
		flatten: function(maxDistance) {
			var flattener = new PathFlattener(this),
				pos = 0,
				step = flattener.length / Math.ceil(flattener.length / maxDistance),
				end = flattener.length + (this.isClosed ? -step : step) / 2;
			var segments = [];
			while (pos <= end) {
				segments.push(new Segment(flattener.evaluate(pos, 0)));
				pos += step;
			}
			this.setSegments(segments);
			
			return this;
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
		
		setSegments: function(segments) {
			this.segments = segments;
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
		
		// TODO
		arcTo: function(through, to) {
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
		
		// TODO
		arcBy: function(vector) {
			return this;
		},
		
		/*
		 * 
		 */
		// TODO
		toClosedShape: function () {},
		
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
