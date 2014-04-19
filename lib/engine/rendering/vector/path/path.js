define(["physics/jello"], function(Jello) {
	/*
	$(document).ready(function() {
		var canvas = document.getElementById("paper-canvas");
		paper.setup(canvas);
		
		var path = new paper.Path({
			strokeColor: 'black',
			fullySelected: true
		});
		path.add(new paper.Point(100, 100));
		path.add(new paper.Point(120, 120));
		path.add(new paper.Point(120, 100));
		path.add(new paper.Point(100,  80));
		path.simplify(10);
		path.fullySelected = true;
		
		console.log(new Jello.Vector2(2,2) instanceof Jello.Vector2 ? "JAAAAAAAAAA" : "NEEEEEEEEEEIIIIIN")
	});
	*/
	
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
				rhs[i] = 4 * knots[i]._x + 2 * knots[i + 1]._x;
			rhs[0] = knots[0]._x + 2 * knots[1]._x;
			rhs[n - 1] = 3 * knots[n - 1]._x;
			var x = getFirstControlPoints(rhs);

			for (var i = 1; i < n - 1; i++)
				rhs[i] = 4 * knots[i]._y + 2 * knots[i + 1]._y;
			rhs[0] = knots[0]._y + 2 * knots[1]._y;
			rhs[n - 1] = 3 * knots[n - 1]._y;
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
					segment.setHandleIn(handleIn.subtract(segment.point));
				if (i < n) {
					segment.setHandleOut(
							new Point(x[i], y[i]).subtract(segment.point));
					handleIn = i < n - 1
							? new Point(
								2 * knots[i + 1]._x - x[i + 1],
								2 * knots[i + 1]._y - y[i + 1])
							: new Point(
								(knots[n]._x + x[n - 1]) / 2,
								(knots[n]._y + y[n - 1]) / 2);
				}
			}
			if (closed && handleIn) {
				var segment = this._segments[0];
				segment.setHandleIn(handleIn.subtract(segment.point));
			}
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
	Path.Circle = function() {};
	
	Path.Segment = Segment;
	Path.Curve = Curve;
	
	/*
	var convertArguments = function(argList) {
		for(var i = 0; i < argList.length; i++)
			if(argList[i] instanceof Jello.Vector2)
				argList[i] = new paper.Point(argList[i].x, argList[i].y);
	};
	
	// mimic objs interface
	var mimicInterface = function(from, to) {
		for(var prop in from) {
			(function(to, prop) {
				to[prop] = function() {
					return from[prop].apply(to.__proxyFor__, convertArguments(arguments));;
				};
			})(to, prop);
		}
		
	};
	
	var ProxyPath = function() {
		this.__proxyFor__ = new paper.Path();
		this.__proxyFor__.initialize.apply(this.__proxyFor__, convertArguments(arguments));
	};
	ProxyPath.__proxyFor__ = paper.Path;
	mimicInterface(paper.Path, ProxyPath);
	mimicInterface(paper.Path.prototype, ProxyPath.prototype);
	*/
	
	return Path;
});
