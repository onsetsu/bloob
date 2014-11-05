define(function(require) {
    var Vector2 = require('num/num').Vector2,
        World = require('./world');

	/*
	 * Helpers
	 */
	var standardEpsilon = 0.0001;
	var nearlyEquals = function(a, b, epsilon) {
		return Math.abs(a - b) <= epsilon;
	};

	/*
	 * SingleIntersection
	 */
	var SingleIntersection = function(pos, body, edgeNumber) {
		this.position = pos;
		this.body = body;
		this.edgeNumber = edgeNumber;
	};

	/*
	 * RayIntersectionObject
	 */
	var RayIntersectionObject = function(ray) {
		this.intersections = [];
		this.ray = ray;
	};

	RayIntersectionObject.prototype.addIntersection = function(pos, body, edgeNumber) {
		this.intersections.push(new SingleIntersection(pos, body, edgeNumber));
	};

	RayIntersectionObject.prototype.sortByDistanceTo = function(point) {
		this.intersections = _.sortBy(
			this.intersections,
			function(intersection) {
				return intersection.position.distance(point);
			}
		);
	};

	RayIntersectionObject.prototype.debugDraw = function(debugDraw) {
		var color = "yellow";
		var opacity = 1.0;
		var lineWidth = 1;

        this.ray.debugDraw(debugDraw, color, opacity, lineWidth);

		this.sortByDistanceTo(this.ray.origin);

		for(var i = 0; i < this.intersections.length; i++) {
			debugDraw.drawPlus(this.intersections[i].position, 10, color, opacity, lineWidth);
		};

		this.debugDrawReflection(debugDraw);
	};

	RayIntersectionObject.prototype.debugDrawReflection = function(debugDraw) {
		if(this.intersections.length == 0)
			return;

		this.reflection.debugDraw(debugDraw, "lightblue");
	};

	/*
	 * PrivateIntersectionObject
	 */
	var PrivateIntersectionObject = function() {
		this.points = [];
	};

	PrivateIntersectionObject.prototype.InsertSolution = function(vec) {
		this.points.push(vec);
	};

	PrivateIntersectionObject.prototype.NumberOfSolutions = function() {
		return this.points.length;
	};

	/*
	 * Raycast
	 */
	var Raycast = {};

	Raycast.query = function(world, ray) {
		this.origin = ray.origin;
		this.direction = ray.direction;

		var result = new RayIntersectionObject(ray);

		this.intersectWorld(ray, result, world);
        result.reflection = this.getReflection(ray, result);

		return result;
	};

	Raycast.intersectWorld = function(ray, result, world) {
		var numberOfBodies = world.mBodies.length;
		for(var i = 0; i < numberOfBodies; i++) {
			this.intersectBody(ray, result, world.getBody(i));
		};
	};

	Raycast.intersectBody = function(ray, result, body) {
		if(!this.intersectAABB(body.getAABB()))
			return;

		var intersects = false;
		for(var i = 0; i < body.getBoundaryCount(); i++) {
			var j = (i < (body.getBoundaryCount()-1)) ? i + 1 : 0;
			var answer = this.intersectLineSegment(
				body.getPointMass(i).Position,
				body.getPointMass(j).Position
			);
			if(answer.NumberOfSolutions() == 0)
				continue;
			intersects = true;
			result.addIntersection(answer.points[0], body, i);
		};

		return intersects;
	};

	Raycast.intersectAABB = function(aabb) {
		/*
		 * check if all points of the aabb are on one side of the line (line, not ray)
		var tlAbove = aabb.getTopLeft().sub(this.origin).crossProduct(this.direction) > 0;
		var trAbove = aabb.getTopRight().sub(this.origin).crossProduct(this.direction) > 0;
		var brAbove = aabb.getBottomRight().sub(this.origin).crossProduct(this.direction) > 0;
		var blAbove = aabb.getBottomLeft().sub(this.origin).crossProduct(this.direction) > 0;
		var intersects = (!(tlAbove && trAbove && brAbove && blAbove) && (tlAbove || trAbove || brAbove || blAbove));
		*/
		if(this.intersectLineSegment(aabb.getTopLeft(), aabb.getTopRight()).NumberOfSolutions() > 0) {
			return true;
		}
		if(this.intersectLineSegment(aabb.getTopRight(), aabb.getBottomRight()).NumberOfSolutions() > 0) {
			return true;
		}
		if(this.intersectLineSegment(aabb.getBottomRight(), aabb.getBottomLeft()).NumberOfSolutions() > 0) {
			return true;
		}
		if(this.intersectLineSegment(aabb.getBottomLeft(), aabb.getTopLeft()).NumberOfSolutions() > 0) {
			return true;
		}
		return false;
	};

	// Ray to LineSegment
	Raycast.intersectLineSegment = function(startPoint, endPoint) {
		var result = new PrivateIntersectionObject();
		
		var answer = this._lineToLineIntersection(this.origin, this.origin.add(this.direction), startPoint, endPoint);
		if(answer.intersects)
		{
			if (answer.r >= 0)
			{
				if (answer.s >= 0 && answer.s <= 1)
				{
					result.InsertSolution(this.origin.add(this.direction.mulFloat(answer.r)));
				}
			}
		}
		return result;
	};
	
	// Used only within this namespace
	Raycast._lineToLineIntersection = function(vertex1, vertex2, vertex3, vertex4) {
		//Make sure the lines aren't parallel
		var vertex1to2 = vertex2.sub(vertex1);
		var vertex3to4 = vertex4.sub(vertex3);
		if(vertex1to2.y / vertex1to2.x != vertex3to4.y / vertex3to4.x)
		{
			var d = vertex1to2.x * vertex3to4.y - vertex1to2.y * vertex3to4.x;
			if (d != 0)
			{
				var vertex3to1 = vertex1.sub(vertex3);
				return {
					intersects: true,
					r: (vertex3to1.y * vertex3to4.x - vertex3to1.x * vertex3to4.y) / d,
					s: (vertex3to1.y * vertex1to2.x - vertex3to1.x * vertex1to2.y) / d
				};
			}
		}
		return {
			intersects: false,
			r: 0,
			s: 0
		};
	};


	Raycast.getReflection = function(ray, result) {
		if(result.intersections.length == 0)
			return {
				origin: Vector2.Zero.copy(),
				direction: Vector2.Zero.copy()
			};

		// get first intersection
		result.sortByDistanceTo(this.origin);
		var reflIntersection = result.intersections[0];
		
		var i = reflIntersection.edgeNumber;
		var j = (i + 1) % reflIntersection.body.getBoundaryCount();
		var vStart = reflIntersection.body.getPointMass(i).Position;
		var vEnd = reflIntersection.body.getPointMass(j).Position;
		var edgeDirection = vEnd.sub(vStart);
		edgeDirection.normalize();
		var reflectedDirection = ray.direction.normalizedCopy().reflectOnNormal(edgeDirection);

		return new RayData(reflIntersection.position, reflectedDirection);
	};
	
    // Add convenient method
    World.prototype.raycast = function(ray) {
        var res = Raycast.query(this, ray);
        return res;
    };

    RayData = function(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    };

    RayData.prototype.debugDraw = function(debugDraw, color, opacity, lineWidth) {
		color = color || "yellow";
		opacity = opacity || 1.0;
		lineWidth = lineWidth || 1;

		debugDraw.drawDot(this.origin, 3, color, opacity);
		debugDraw.drawLine(
			this.origin,
			this.origin.add(this.direction.mulFloat(1000)),
			color,
			opacity,
			lineWidth
		);
    };

	return RayData;
});
