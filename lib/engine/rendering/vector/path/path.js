define(["physics/jello"], function(Jello) {
	var kappa = 0.5522847498307936;

	var Segment = mini.Class.subclass({
		initialize: function(point, inHandle, outHandle) {
			this.point = point;
			this.inHandle = inHandle || Jello.Vector2.Zero.copy();
			this.outHandle = outHandle || Jello.Vector2.Zero.copy();
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
		
		add: function(segment) {
			this.segments.push(segment);
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
		
		getIsClosed: function() {
			return this.isClosed;
		},
		
		setIsClosed: function(isClosed) {
			this.isClosed = isClosed;
			
			return this;
		},
		
		// drawing utilities
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
	Path.Circle = function() {};
	
	Path.Segment = Segment;
	Path.Curve = Curve;
	
	return Path;
});
