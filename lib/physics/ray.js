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
var RayIntersectionObject = function(pos, body, edgeNumber) {
	this.intersections = [];
};

RayIntersectionObject.prototype.addIntersection = function(pos, body, edgeNumber) {
	this.intersections.push(new SingleIntersection(pos, body, edgeNumber));
};

RayIntersectionObject.prototype.sortByDistanceTo = function(point) {
	this.intersections = _.sortBy(
		this.intersections,
		function(intersection) {
			return intersection.position.sub(point).length();
		}
	);
};

RayIntersectionObject.prototype.flush = function() {
	this.intersections.length = 0;
};

/*
 * PrivateIntersectionObject
 */
var PrivateIntersectionObject = function() {
	this.points = [];
};

PrivateIntersectionObject.prototype.InsertSolution = function(v) { // Vector2
	this.points.push(v);
};

PrivateIntersectionObject.prototype.NumberOfSolutions = function() { // returns int
	return this.points.length;
};

/*
 * Ray
 */
var Ray = function(world, origin, direction) {
	this.world = world;
	this.origin = origin;
	this.direction = direction;
	
	this.intersections = new RayIntersectionObject();
	
	world.addRay(this);
};

Ray.prototype.update = function() {
	this.intersections.flush();

	this.intersectWorld(this.world);
};

Ray.prototype.intersectWorld = function(world) {
	for(var i = 0; i < world.mBodies.length; i++) {
		this.intersectBody(world.getBody(i));
	};
};

Ray.prototype.intersectBody = function(body) {
	if(!this.intersectAABB(body.mAABB))
		return;

	var intersects = false;
	for(var i = 0; i < body.mPointCount; i++) {
		var j = (i < (body.mPointCount-1)) ? i + 1 : 0;
		var answer = this.intersectLineSegment(
			body.pointMasses[i].Position,
			body.pointMasses[j].Position
		);
		if(answer.NumberOfSolutions() == 0)
			continue;
		intersects = true;
		this.intersections.addIntersection(answer.points[0], body, i);
	};

	return intersects;
};

Ray.prototype.intersectAABB = function(aabb) {
	if(this.intersectLineSegment(aabb.getTopLeft(), aabb.getTopRight()).NumberOfSolutions() > 0)
		return true;
	if(this.intersectLineSegment(aabb.getTopRight(), aabb.getBottomRight()).NumberOfSolutions() > 0)
		return true ;
	if(this.intersectLineSegment(aabb.getBottomRight(), aabb.getBottomLeft()).NumberOfSolutions() > 0)
		return true;
	if(this.intersectLineSegment(aabb.getBottomLeft(), aabb.getTopLeft()).NumberOfSolutions() > 0)
		return true;
	return false;
};

Ray.prototype.intersectLineSegment = function(startPoint, endPoint) {

	// Used only within this namespace
	var PrivateLineToLineIntersection = function(vertex1, vertex2, vertex3, vertex4) {
		var d; // float
		
		//Make sure the lines aren't parallel
		var vertex1to2 = vertex2.sub(vertex1); // Vector2
		var vertex3to4 = vertex4.sub(vertex3); // Vector2
		if(vertex1to2.y / vertex1to2.x != vertex3to4.y / vertex3to4.x)
		{
			d = vertex1to2.x * vertex3to4.y - vertex1to2.y * vertex3to4.x;
			if (d != 0)
			{
				var vertex3to1 = vertex1.sub(vertex3); // Vector2
				return {
					"intersects": true,
					"r": (vertex3to1.y * vertex3to4.x - vertex3to1.x * vertex3to4.y) / d,
					"s": (vertex3to1.y * vertex1to2.x - vertex3to1.x * vertex1to2.y) / d
				};
			}
		}
		return {
			"intersects": false,
			"r": 0,
			"s": 0
		};
	};

	// Ray to LineSegment
	var RayToLineSegmentIntersection = function(vertex1, vertex2, vertex3, vertex4) {
		var result = new PrivateIntersectionObject();
		
		var answer = PrivateLineToLineIntersection(vertex1, vertex2, vertex3, vertex4);
		if(answer.intersects)
		{
			if (answer.r >= 0)
			{
				if (answer.s >= 0 && answer.s <= 1)
				{
					result.InsertSolution(vertex1.add(vertex2.sub(vertex1).mulFloat(answer.r)));
				}
			}
		}
		return result;
	};

	return RayToLineSegmentIntersection(
		this.origin,
		this.origin.add(this.direction),
		startPoint,
		endPoint
	);
};

Ray.prototype.getReflection = function() {
	if(this.intersections.intersections.length == 0)
		return {
			"position": Vector2.Zero.copy(),
			"direction": Vector2.Zero.copy()
		};

	// get first intersection
	this.intersections.sortByDistanceTo(this.origin);
	var reflIntersection = this.intersections.intersections[0];
	
	var i = reflIntersection.edgeNumber;
	var j = (i < (reflIntersection.body.mPointCount-1)) ? i + 1 : 0;
	var vStart = reflIntersection.body.pointMasses[i].Position;
	var vEnd = reflIntersection.body.pointMasses[j].Position;
	var edgeDirection = vEnd.sub(vStart);
	var edgeNormal = edgeDirection.getPerpendicular();
	var reflectedDirection = this.direction.reflectOnNormal(edgeNormal);

	return {
		"position": reflIntersection.position,
		"direction": reflectedDirection
	};
};

Ray.prototype.debugDraw = function(debugDraw) {
	debugDraw.setOptions({
		"color": "yellow",
		"opacity": 1.0,
		"lineWidth": 1
	});
	
	debugDraw.drawDot(this.origin, 3);
	debugDraw.drawPolyline([
		this.origin,
		this.origin.add(this.direction.mulFloat(1000))
	]);
	
	this.intersections.sortByDistanceTo(this.origin);
	
	for(var i = 0; i < this.intersections.intersections.length; i++) {
		debugDraw.drawPlus(this.intersections.intersections[i].position, 5);
	};
	
	this.debugDrawReflection(debugDraw);
};

Ray.prototype.debugDrawReflection = function(debugDraw) {
	if(this.intersections.intersections.length == 0)
		return;

	debugDraw.setOptions({
		"color": "lightblue",
		"opacity": 1.0,
		"lineWidth": 1
	});
	
	var reflection = this.getReflection();

	debugDraw.drawDot(reflection.position, 3);
	debugDraw.drawPolyline([
		reflection.position,
		reflection.position.add(reflection.direction.mulFloat(1000))
	]);
};
