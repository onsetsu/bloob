define([
    "physics/vector2",
    "physics/world"
], function(Vector2, World) {
	/*
	 * Helpers
	 */
	var standardEpsilon = 0.0001;
	var nearlyEquals = function(a, b, epsilon) {
		return Math.abs(a - b) <= (epsilon || standardEpsilon);
	};

    /*
     *
     */
    var CircleCastResult = function() {

    };

    var CircleCastLineResult = function() {

    };

	/*
	 * CircleCast
	 */
	var CircleCast = function(world, data) {
		this.world = world;
		this.origin = data.origin;
		this.radius = data.radius;

		this.intersections = [];
	};

	CircleCast.prototype.update = function() {
	    this.intersections.length = 0;

		this.intersectWorld(this.world);
	};

	CircleCast.prototype.intersectWorld = function(world) {
		var numberOfBodies = world.mBodies.length;
		for(var i = 0; i < numberOfBodies; i++) {
			this.intersectBody(world.getBody(i));
		};
	};

	CircleCast.prototype.intersectBody = function(body) {
		if(!this.intersectAABB(body.getAABB())) {
			return;
		}

		var intersects = false;
		var pointMassCount = body.getBoundaryCount();
		if(pointMassCount == 1) {
		    intersects = true;
		} else {
            var prevPosition = body.getPointMass(pointMassCount-1).Position;
            for(var i = 0; i < pointMassCount; i++) {
                var j = (i < (pointMassCount-1)) ? i + 1 : 0;
                var answer = this.intersectLineSegment(
                    body.getPointMass(i).Position,
                    body.getPointMass(j).Position
                );
                if(answer) {
                    intersects = true;
                }
            };
		}

        if(intersects) {
		    this.intersections.push(body.getDerivedPosition().copy());
        }
		return intersects;
	};

    // algorithm: http://stackoverflow.com/a/402010/1152174
	CircleCast.prototype.intersectAABB = function(aabb) {
        var halfExtent = aabb.getSize().divFloat(2);
        var circleDistance = this.origin.sub(aabb.getMiddle()).absolute();

        if(circleDistance.x > (halfExtent.x + this.radius)) { return false; }
        if(circleDistance.y > (halfExtent.y + this.radius)) { return false; }

        if(circleDistance.x <= (halfExtent.x)) { return true; }
        if(circleDistance.y <= (halfExtent.y)) { return true; }

        var cornerDistance_sq = circleDistance.distanceSquared(halfExtent);

		return cornerDistance_sq <= this.radius * this.radius;
	};

	// Circle to LineSegment
	CircleCast.prototype.intersectLineSegment = function(startPoint, endPoint) {
	    var answer = getIntersections.call(this, startPoint, endPoint);
        if(answer.intersectsOrInside) {
            var shouldReturnTrue = false;
            for(var i = 0; i < answer.points.length; i++) {
                var point = answer.points[i];
                if(point.onLine) {
                    this.intersections.push(point.coords);
                    shouldReturnTrue = true;
                }
            }
            if(shouldReturnTrue) {
                return true;
            }
        }
        return false;

		// GEOMETRIC function to get the intersections
        function getIntersections(a, b) {
            var c = this.origin;

        	// Calculate the euclidean distance between a & b
        	eDistAtoB = a.distance(b);

        	// compute the direction vector d from a to b
        	var d = b.sub(a).divFloat(eDistAtoB);

        	// Now the line equation is x = dx*t + ax, y = dy*t + ay with 0 <= t <= 1.

        	// compute the value t of the closest point to the circle center (c/origin)
        	var t = (d.x * (c.x-a.x)) + (d.y * (c.y-a.y));

        	// compute the coordinates of the point e on line and closest to c
            var e = {
                coords: d.mulFloat(t).add(a),
                onLine: false
            };

        	// Calculate the euclidean distance between c & e
        	eDistCtoE = e.coords.distance(c);

        	// test if the line intersects the circle
        	if( eDistCtoE < this.radius ) {
        		// compute distance from t to circle intersection point
        	    var dt = Math.sqrt( Math.pow(this.radius, 2) - Math.pow(eDistCtoE, 2));

        	    // compute first intersection point
        	    var f = {coords:[], onLine:false};
        	    f.coords = d.mulFloat(t-dt).add(a);
        	    // check if f lies on the line
        	    f.onLine = is_on(a,b,f.coords);

        	    // compute second intersection point
        	    var g = {coords:[], onLine:false};
        	    g.coords = d.mulFloat(t+dt).add(a);
        	    // check if g lies on the line
        	    g.onLine = is_on(a,b,g.coords);

        		return {
        		    intersectsOrInside: true,
        		    points: [f, g]
        		};

        	} else if (parseInt(eDistCtoE) === parseInt(this.radius)) {
        		return {
        		    intersectsOrInside: true,
        		    points: [e]
        		};
        	} else {
        		return {
        		    intersectsOrInside: false,
        		    points: []
        		};
        	}
        }

        // BASIC GEOMETRIC functions
        function is_on(a, b, c) {
        	return nearlyEquals(a.distance(c) + c.distance(b), a.distance(b));
        }
	};

	CircleCast.prototype.debugDraw = function(debugDraw) {
		var color = "yellow";
		var opacity = 1.0;
		var lineWidth = 1;

		debugDraw.drawDot(this.origin, 3, color, opacity);
		debugDraw.drawCircle(
			this.origin,
			this.radius,
			color,
			opacity,
			lineWidth
		);

		for(var i = 0; i < this.intersections.length; i++) {
			var pos = this.intersections[i];
			debugDraw.drawRectangle(pos, 7, color, 1.0);
		};
	};

    // Add convenient method
    World.prototype.circlecast = function(circle) {
        var res = new CircleCast(this, circle);
        res.update();
        return res;
    };

    // input data
    CircleData = function(origin, radius) {
         this.origin = origin;
         this.radius = radius;
    };

	return CircleData;
});
