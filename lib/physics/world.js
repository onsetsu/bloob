var World = function() {
	// default values
	this.mBodies = []; // std::vector<Body*>
	this.mJoints = [];
	this.mParticleCannons = [];
	this.mRays = [];
	this._triggerFields = [];
	
	this.mWorldLimits = new AABB(); // AABB
	this.mWorldSize = new Vector2(0.0, 0.0); // Vector2
	this.mWorldGridStep = new Vector2(0.0, 0.0); // Vector2
		
	this.mPenetrationThreshold = 0.0; // float
	this.mPenetrationCount = 0; // int
	
	this.mCollisionList = []; //std::vector<BodyCollisionInfo>

	this.materialManager = new MaterialManager();
	this.contactManager = new ContactManager();

	this.setWorldLimits(new Vector2(-20,-20), new Vector2(20,20));
		
	this.mPenetrationThreshold = 0.3;
	this.mPenetrationCount = 0;
};

World.gravitation = new Vector2(0, -9.81);

World.prototype.setWorldLimits = function( min, max) { //  const Vector2& , const Vector2& 
	this.mWorldLimits = new AABB(min, max);
	this.mWorldSize = max.sub(min);
	this.mWorldGridStep = this.mWorldSize / 32;
		
	// update bitmasks for all bodies.
	for(var i = 0; i < this.mBodies.length; i++)
		this.updateBodyBitmask(this.mBodies[i]);
};

// Idea: Devide the world into a 32x32 grid
// determine in which grid spaces the object is present
// adjust its bitmask like this
World.prototype.updateBodyBitmask = function(body) { // Body* 
	var box = body.getAABB(); // AABB
	
	//var minX = Math.floor((box.Min.x - mWorldLimits.Min.x) / this.mWorldGridStep.x); // int
	//var maxX = Math.floor((box.Max.x - mWorldLimits.Min.x) / this.mWorldGridStep.x); // int
	
	//if (minX < 0) { minX = 0; } else if (minX > 31) { minX = 31; }
	//if (maxX < 0) { maxX = 0; } else if (maxX > 31) { maxX = 31; }
	
	// determine minimum and maximum grid 
	var minY = Math.floor((
		box.Min.y - 
		this.mWorldLimits.Min.y
	) / this.mWorldGridStep.y); // int
	var maxY = Math.floor((box.Max.y - this.mWorldLimits.Min.y) / this.mWorldGridStep.y); // int

	// Adjust if object have fallen out of the world
	if (minY < 0) { minY = 0; } else if (minY > 31) { minY = 31; };
	if (maxY < 0) { maxY = 0; } else if (maxY > 31) { maxY = 31; };
	
	
	//body->mBitMaskX.clear();
	//for (int i = minX; i <= maxX; i++)
	//	body->mBitMaskX.setOn(i);
	
	
	body.mBitMaskY.clear();
	for(var i = minY; i <= maxY; i++)
		body.mBitMaskY.setOn(i);
	
	//Console.WriteLine("Body bitmask: minX{0} maxX{1} minY{2} maxY{3}", minX, maxX, minY, minY, maxY);
};

World.prototype.addBody = function(b) { // Body
	DEBUG("addBody:", b);

	// check for already existing.
	var exists = false; // bool
	for(var i = 0; i < this.mBodies.length; i++)
		if(this.mBodies[i] == b) {
			exists = true;
			break;
		};
	
	// do not add an already existing body
	if (!exists) {
		this.mBodies.push(b);
		// TODO: introduce possibility to not be affected by gravity
		b.addExternalForce(this.applyGravitationTo);
	}
};

World.prototype.removeBody = function(b) { // Body
	var index = this.mBodies.indexOf(b);
	if (index !== - 1) {
		this.mBodies.splice( index, 1 );
	}
};

World.prototype.addJoint = function(j) { // Joint
	DEBUG("addJoint:", j);

	// check for already existing.
	var exists = false; // bool
	for(var i = 0; i < this.mJoints.length; i++)
		if(this.mJoints[i] == j) {
			exists = true;
			break;
		};
	
	// do not add an already existing joint
	if (!exists) {
		this.mJoints.push(j);
	}
};

World.prototype.removeJoint = function(j) { // Joint
	var index = this.mJoints.indexOf(j);
	if (index !== - 1) {
		this.mJoints.splice( index, 1 );
	}
};

World.prototype.addParticleCannon = function(pc) { // ParticleCannon
	DEBUG("addParticleCannon:", pc);

	// check for already existing.
	var exists = false; // bool
	for(var i = 0; i < this.mParticleCannons.length; i++)
		if(this.mParticleCannons[i] == pc) {
			exists = true;
			break;
		};
	
	// do not add an already existing particle cannon
	if (!exists) {
		this.mParticleCannons.push(pc);
	}
};

World.prototype.addRay = function(r) { // Joint
	DEBUG("addRay:", r);

	// check for already existing.
	var exists = false; // bool
	for(var i = 0; i < this.mRays.length; i++)
		if(this.mRays[i] == r) {
			exists = true;
			break;
		};
	
	// do not add an already existing joint
	if (!exists) {
		this.mRays.push(r);
	}
};

World.prototype.addTriggerField = function(field) { // TriggerField
	DEBUG("addTriggerField:", field);

	// check for already existing.
	var exists = false; // bool
	for(var i = 0; i < this._triggerFields.length; i++)
		if(this._triggerFields[i] == field) {
			exists = true;
			break;
		};
	
	// do not add an already existing fields
	if (!exists) {
		this._triggerFields.push(field);
	}
};

World.prototype.removeTriggerField = function(field) { // TriggerField
	var index = this._triggerFields.indexOf(field);
	if (index !== - 1) {
		this._triggerFields.splice( index, 1 );
	}
};

World.prototype.getBody = function(index) { // int, returns Body
	if ((index >= 0) && (index < this.mBodies.length))
		return this.mBodies[index];
	return undefined;
};

World.prototype.applyGravitationTo = function(body) {
	body.addGlobalForce(
		new Vector2(0.0,0.0).add(body.mDerivedPos),
		World.gravitation
	);
};

World.prototype.update = function(timePassed) { // float
	this.mPenetrationCount = 0;
	this.mCollisionList.length = 0;

	for (var i = 0; i < this.mBodies.length; i++)
		this.mBodies[i].callBeforeUpdate(timePassed);
	
	// first, accumulate all forces acting on PointMasses.
	for(var i = 0; i < this.mBodies.length; i++)
	{
		var body = this.mBodies[i];

		if(body.getIsStatic() || body.getIgnoreMe()) { continue; }
		
		body.derivePositionAndAngle(timePassed);
		body.accumulateExternalForces();
		body.accumulateInternalForces();
	}
	
	// accumulate distance joints
	for(var i = 0; i < this.mJoints.length; i++)
	{
		var joint = this.mJoints[i];
		
		joint.applyForce(timePassed);
	}
	
	// now integrate.
	for(var i = 0; i < this.mBodies.length; i++)
	{
		//if this.mBodies[i].getIsStatic()) { continue; }
		
		// hard coded force on first Pointmass
		//this.mBodies[i].pointMasses[0].Force = new Vector2(0.0,9.81);
		//this.mBodies[i].pointMasses[0].Mass = 1;
		
		this.mBodies[i].integrate(timePassed);
	}

	// update all bounding boxes, and then bitmasks.
	for(var i = 0; i < this.mBodies.length; i++)
	{
		var body = this.mBodies[i];

		if(body.getIsStatic() || body.getIgnoreMe()) { continue; }
		
		body.updateAABB(timePassed);
		this.updateBodyBitmask(body);
		body.updateEdgeInfo();
	}

	// now check for collision.
	//for (var i = 0; i < this.mBodies.length; i++)
	//{
		//var bA = this.mBodies[i]; // Body* 
		//if (bA.getIsStatic() || bA.getIgnoreMe())
			//continue;
		
		
		// // OLD, BRUTE-FORCE COLLISION CHECKS USING BITMASKS ONLY FOR OPTIMIZATION.
		////for (int j = i + 1; j < mBodies.size(); j++)
		////{
		////	_goNarrowCheck( mBodies[i], mBodies[j] );
		////}
		
		
		//var bS = bA.mBoundStart; // Body::BodyBoundary*
		//var bE = bA.mBoundEnd; // Body::BodyBoundary*
		//var cur = bS.next; // Body::BodyBoundary*
		
		//var passedMyEnd = false; // bool
		//while (cur)
		//{
			//if (cur == bE)
			//{
			//	passedMyEnd = true;
			//}
			//else if ((cur.type == Begin) && (!passedMyEnd))
			//{
				// overlapping, do narrow-phase check on this body pair.
			//	this._goNarrowCheck(bA, cur.body);
			//}
			//else if (cur.type == End)
			//{
				// this is an end... the only situation in which we didn't already catch this body from its "begin",
				// is if the begin of this body starts before our own begin.
				//if (cur.body.mBoundStart.value <= bS.value)
				//{
					// overlapping, do narrow-phase check on this body pair.
				//	this._goNarrowCheck(bA, cur.body);
				//}
			//}
			//else if (cur.type == VoidMarker)
			//{
				//break;
			//}
			
			//cur = cur.next;
		//}
	//}
	// TODO: at the moment: only use simple collision check with AABB
	for (var i = 0; i < this.mBodies.length; i++) {
		var bA = this.mBodies[i]; // Body* 
		if (bA.getIsStatic() || bA.getIgnoreMe())
			continue;
		for (var j = i+1; j < this.mBodies.length; j++) {
			this._goNarrowCheck(this.mBodies[i], this.mBodies[j]);
		}
	}

	
	
	
	//printf("\n\n");
	
	// now handle all collisions found during the update at once.
	this._handleCollisions();

	this.contactManager.processCollisions(this);
	
	// now dampen velocities.
	for (var i = 0; i < this.mBodies.length; i++)
	{
		if(this.mBodies[i].getIsStatic()) { continue; }
		this.mBodies[i].dampenVelocity();
	}

	for (var i = 0; i < this.mBodies.length; i++)
		this.mBodies[i].callWithUpdate(timePassed);

	for (var i = 0; i < this.mBodies.length; i++)
		this.mBodies[i].callAfterUpdate(timePassed);
	
	// update rays
	for (var i = 0; i < this.mRays.length; i++)
	{
		this.mRays[i].update();
	}
	
	// update trigger fields
	for (var i = 0; i < this._triggerFields.length; i++)
	{
		this._triggerFields[i].update();
	}
	
	// fire queued events
	this.queue().fire();
	
};

World.prototype.queue = function() {
	if(typeof this.__queue__ === "undefined")
		this.__queue__ = new Queue(this);
	return this.__queue__;
};

World.prototype._goNarrowCheck = function(bI, bJ) { // Body*, Body*
	//printf("goNarrow %d vs. %d\n", bI, bJ);

	// TODO: something seems to went wrong here
	// - Bitmask do not work -> therefore outcommented
	// grid-based early out.
	//if ( //((bI->mBitMaskX.mask & bJ->mBitMaskX.mask) == 0) && 
		//((bI.mBitMaskY.mask & bJ.mBitMaskY.mask) == 0))
	//{
		//printf("update - no bitmask overlap.\n");
		//return;
	//}

	// early out - these bodies materials are set NOT to collide
	if (!this.materialManager.getMaterialPair(bI.getMaterial(), bJ.getMaterial()).Collide)
	{
		//printf("update - material early out: %d vs. %d\n", mBodies[i]->getMaterial(), mBodies[j]->getMaterial());
		return;
	}

	// broad-phase collision via AABB.
	var boxA = bI.getAABB(); // const AABB&
	var boxB = bJ.getAABB(); // const AABB& 

	// early out
	if (!boxA.intersects(boxB))
	{
		//printf("update - no AABB overlap.\n");
		return;
	}

	// okay, the AABB's of these 2 are intersecting.  now check for collision of A against B.
	this.bodyCollide(bI, bJ, this.mCollisionList);
	
	// and the opposite case, B colliding with A
	this.bodyCollide(bJ, bI, this.mCollisionList);
};

World.prototype.bodyCollide = function(bA, bB, infoList) { // Body*, Body*, std::vector<BodyCollisionInfo>&
	var bApmCount = bA.getPointMassCount(); // int
	
	var boxB = bB.getAABB(); // AABB
	
	// check all PointMasses on bodyA for collision against bodyB.  if there is a collision, return detailed info.
	for (var i = 0; i < bApmCount; i++)
	{
		var pt = bA.getPointMass(i).Position; // Vector2
		
		// early out - if this point is outside the bounding box for bodyB, skip it!
		if (!boxB.contains(pt))
		{
			//printf("bodyCollide - bodyB AABB does not contain pt\n");
			continue;
		}
		
		// early out - if this point is not inside bodyB, skip it!
		if (!bB.contains(pt))
		{
			//printf("bodyCollide - bodyB does not contain pt\n");
			continue;
		}
		
		var collisionInfo = this._collisionPointBody(bB, bA, i);
		if(collisionInfo)
			infoList.push(collisionInfo);
		continue;
	}
};

World.prototype._collisionPointBody = function(penetratedBody, bodyOfPoint, indexOfPoint) {
	
	// penetration point variables	
	var pointInPolygon = bodyOfPoint.getPointMass(indexOfPoint).Position;
	var normalForPointInPolygon = (function getNormalOfPenetrationPoint(body, i) {
	
		// get index of the previous and next point in pointmasslist
		var numberOfPointMasses = body.getPointMassCount();
		var previosPointIndex = (i > 0) ? i-1 : numberOfPointMasses - 1; // int
		var nextPointIndex = (i < numberOfPointMasses - 1) ? i + 1 : 0; // int
		
		// get previos and next point in pointmasslist
		var previosPoint = body.getPointMass(previosPointIndex).Position; // Vector2
		var nextPoint = body.getPointMass(nextPointIndex).Position; // Vector2
		
		// now get the normal for this point. (NOT A UNIT VECTOR)
		var fromPreviosPoint = pointInPolygon.sub(previosPoint); // Vector2
		var toNextPoint = nextPoint.sub(pointInPolygon); // Vector2
		
		var normalForPoint = fromPreviosPoint.add(toNextPoint); // Vector2
		normalForPoint.makePerpendicular();
	
		return normalForPoint;
	})(bodyOfPoint, indexOfPoint);
	
	// penetrated body variables
	var numberOfPointMasses = penetratedBody.getPointMassCount();
	var indexEdgeStart = numberOfPointMasses;
	var indexEdgeEnd = 0;
	var edgeStart;
	var edgeEnd;
	var normalForEdge;
	
	// result variables
	var resultIndexEdgeStart = -1;
	var resultIndexEdgeEnd = -1;
	var resultPercentageToClosestPoint;
	var resultClosestPointOnEdge;
	var resultDistance = 1000000000.0;
	var resultEdgeNormal;
	
	var opposingEdgeAlreadyFound = false;
	var opposingEdge = false;
	
	while(indexEdgeStart--) {
	
		// Calculate closest point on the line that is tangent to each edge of the polygon.
		edgeStart = penetratedBody.getPointMass(indexEdgeStart).Position;
		edgeEnd = penetratedBody.getPointMass(indexEdgeEnd).Position;
		
		var percentageToClosestPoint = 
			(
				((pointInPolygon.x - edgeStart.x)*(edgeEnd.x - edgeStart.x))
				+
				((pointInPolygon.y - edgeStart.y)*(edgeEnd.y - edgeStart.y))
			)
			/
			(
				Math.pow((edgeEnd.x - edgeStart.x), 2)
				+
				Math.pow((edgeEnd.y - edgeStart.y), 2)
			);
		
		// Calculate closest point on each line segment (edge of the polygon) to the point in question.
		if(percentageToClosestPoint < 0)
			var closestPointOnEdge = edgeStart.copy();
		else if(percentageToClosestPoint > 1)
			var closestPointOnEdge = edgeEnd.copy();
		else
			var closestPointOnEdge = new Vector2(
				edgeStart.x + percentageToClosestPoint * (edgeEnd.x - edgeStart.x),
				edgeStart.y + percentageToClosestPoint * (edgeEnd.y - edgeStart.y)
			);
		
		// Calculate the distance from the closest point on each line segment to the point in question.
		var distance = Math.sqrt(
			Math.pow((pointInPolygon.x - closestPointOnEdge.x), 2) +
			Math.pow((pointInPolygon.y - closestPointOnEdge.y), 2)
		);
		
		var edgeNormal = edgeEnd.sub(edgeStart);
		edgeNormal = /*new Vector2(edgeNormal.y * -1, edgeNormal.x).copy();//*/edgeNormal.getPerpendicular();
		edgeNormal.normalize();
		
		var dot = normalForPointInPolygon.dotProduct(edgeNormal); // float

		opposingEdge = dot <= 0.0;

		// Find the minimum distance.
		if(
			// TODO: is this condition right????
			((!(opposingEdgeAlreadyFound)) && (opposingEdge || distance < resultDistance)) ||
			(opposingEdgeAlreadyFound && opposingEdge && distance < resultDistance)
		) {
			resultDistance = distance;
			resultIndexEdgeStart = indexEdgeStart;
			resultIndexEdgeEnd = indexEdgeEnd;
			resultPercentageToClosestPoint = percentageToClosestPoint;
			resultClosestPointOnEdge = closestPointOnEdge;
			resultEdgeNormal = edgeNormal;
		};
		if(opposingEdge) opposingEdgeAlreadyFound = true;
		
		indexEdgeEnd = indexEdgeStart;
	}
	
	var collisionInfo = new BodyCollisionInfo();
	collisionInfo.bodyA = bodyOfPoint; // Body
	collisionInfo.bodyB = penetratedBody; // Body

	collisionInfo.bodyApm = indexOfPoint; // int
	collisionInfo.bodyBpmA = resultIndexEdgeStart; // int
	collisionInfo.bodyBpmB = resultIndexEdgeEnd; // int

	collisionInfo.hitPt = resultClosestPointOnEdge; // Vector2	
	collisionInfo.edgeD = resultPercentageToClosestPoint; // float
	collisionInfo.norm = resultEdgeNormal; // Vector2	
	collisionInfo.penetration = resultDistance; // float
	return collisionInfo;
};

World.prototype._handleCollisions = function() {
	//printf("handleCollisions - count %d\n", mCollisionList.size());
	
	// handle all collisions!
	for (var i = 0; i < this.mCollisionList.length; i++)
	{
		var info = this.mCollisionList[i]; // BodyCollisionInfo
		
		var A = info.bodyA.getPointMass(info.bodyApm); // PointMass*
		var B1 = info.bodyB.getPointMass(info.bodyBpmA); // PointMass*
		var B2 = info.bodyB.getPointMass(info.bodyBpmB); // PointMass*

		// velocity changes as a result of collision.
		var bVel = (B1.Velocity.add(B2.Velocity)).mulFloat(0.5); // Vector2
		var relVel = A.Velocity.sub(bVel); // Vector2

		var relDot = relVel.dotProduct(info.norm); // float

		//printf("handleCollisions - relVel:[x:%f][y:%f] relDot:%f\n",
		//	   relVel.X, relVel.Y, relDot);
		
		// collision filter!
		//if (!mMaterialPairs[info.bodyA.Material, info.bodyB.Material].CollisionFilter(info.bodyA, info.bodyApm, info.bodyB, info.bodyBpmA, info.bodyBpmB, info.hitPt, relDot))
		//	continue;
		var cf = this.materialManager.getMaterialPair(info.bodyA.getMaterial(), info.bodyB.getMaterial()).Callback; // CollisionCallback*
		if (cf)
		{
			if (!cf.collisionFilter(info.bodyA, info.bodyApm, info.bodyB, info.bodyBpmA, info.bodyBpmB, info.hitPt, relDot))
				continue;
		}

		if (info.penetration > this.mPenetrationThreshold)
		{
			//Console.WriteLine("penetration above Penetration Threshold!!  penetration={0}  threshold={1} difference={2}",
			//    info.penetration, mPenetrationThreshold, info.penetration-mPenetrationThreshold);
			//printf("handleCollisions - penetration above threshold! threshold:%f penetration:%f diff:%f\n",
			//	   mPenetrationThreshold, info.penetration, info.penetration - mPenetrationThreshold);
			
			this.mPenetrationCount++;
			continue;
		}

		var b1inf = 1.0 - info.edgeD; // float
		var b2inf = info.edgeD; // float
		
		var b2MassSum = ((B1.Mass == 0.0) || (B2.Mass == 0.0)) ? 0.0 : (B1.Mass + B2.Mass); // float
		
		var massSum = A.Mass + b2MassSum; // float
		
		var Amove; // float
		var Bmove; // float
		if (A.Mass == 0.0)
		{
			Amove = 0.0;
			Bmove = (info.penetration) + 0.001;
		}
		else if (b2MassSum == 0.0)
		{
			Amove = (info.penetration) + 0.001;
			Bmove = 0.0;
		}
		else
		{
			Amove = (info.penetration * (b2MassSum / massSum));
			Bmove = (info.penetration * (A.Mass / massSum));
		}
		
		var B1move = Bmove * b1inf; // float
		var B2move = Bmove * b2inf; // float
		
		//printf("handleCollisions - Amove:%f B1move:%f B2move:%f\n",
		//	   Amove, B1move, B2move)
		//if(false) {
		if (A.Mass != 0.0)
		{
			A.Position.addSelf(info.norm.mulFloat(Amove));
		}
		
		if (B1.Mass != 0.0)
		{
			B1.Position.subSelf(info.norm.mulFloat(B1move));
		}
		
		if (B2.Mass != 0.0)
		{
			B2.Position.subSelf(info.norm.mulFloat(B2move));
		}
		//}
		var AinvMass = (A.Mass == 0.0) ? 0.0 : 1.0 / A.Mass; // float
		var BinvMass = (b2MassSum == 0.0) ? 0.0 : 1.0 / b2MassSum; // float
		
		var jDenom = AinvMass + BinvMass; // float
		var elas = 1.0 + this.materialManager.getMaterialPair(info.bodyA.getMaterial(), info.bodyB.getMaterial()).Elasticity; // float
		var numV = relVel.mulFloat(elas); // Vector2
		
		var jNumerator = numV.dotProduct(info.norm); // float
		jNumerator = -jNumerator;
		
		var j = jNumerator / jDenom; // float
		
		
		var tangent = info.norm.getPerpendicular(); // Vector2
		var friction = this.materialManager.getMaterialPair(info.bodyA.getMaterial(), info.bodyB.getMaterial()).Friction; // float
		var fNumerator = relVel.dotProduct(tangent); // float
		fNumerator *= friction;
		var f = fNumerator / jDenom; // float

		// adjust velocity if relative velocity is moving toward each other.
		if (relDot <= 0.0001)
		{
			if (A.Mass != 0.0)
			{
				A.Velocity.addSelf((info.norm.mulFloat(j / A.Mass)).sub(tangent.mulFloat(f / A.Mass)));
			}
			
			if (b2MassSum != 0.0)
			{
				B1.Velocity.subSelf((info.norm.mulFloat((j / b2MassSum) * b1inf)).sub(tangent.mulFloat((f / b2MassSum) * b1inf)));
			}
			
			if (b2MassSum != 0.0)
			{
				B2.Velocity.subSelf((info.norm.mulFloat((j / b2MassSum) * b2inf)).sub(tangent.mulFloat((f / b2MassSum) * b2inf)));
			}
		}
	}
};

World.prototype.getClosestPointMass = function(pt, bodyID, pmID ) { //  Vector2, int, int
	bodyID = -1;
	pmID = -1;
	
	var closestD = 100000.0; // float
	for (var i = 0; i < this.mBodies.length; i++)
	{
		var dist = 0.0; // float
		var answer = this.mBodies[i].getClosestPointMass(pt, dist);
		pm = answer.pointMassId; // int
		dist = answer.distance; // float
		if (dist < closestD)
		{
			closestD = dist;
			bodyID = i;
			pmID = pm;
		}
	}
	
	return {
		"bodyId": bodyID,
		"pointMassId": pmID
	};
};


World.prototype.debugDraw = function(debugDraw) {
	
	// draw Joints
	for(var i = 0; i < this.mJoints.length; i++) {
		this.mJoints[i].debugDraw(debugDraw);
	};
	
	// draw Bodies
	for(var i = 0; i < this.mBodies.length; i++) {
		this.mBodies[i].debugDraw(debugDraw);
	};
	
	// draw CollisionList
	for(var i = 0; i < this.mCollisionList.length; i++) {
		this.mCollisionList[i].debugDraw(debugDraw);
	};

	// draw Rays
	for(var i = 0; i < this.mRays.length; i++) {
		this.mRays[i].debugDraw(debugDraw);
	};

	// draw TriggerFields
	for(var i = 0; i < this._triggerFields.length; i++) {
		this._triggerFields[i].debugDraw(debugDraw);
	};
};


	
/*



#ifndef _WORLD_H
#define _WORLD_H

#include "JellyPrerequisites.h"
#include "Vector2.h"
#include "Body.h"


namespace JellyPhysics 
{

	class World 
	{
	public:
		

		
	private:
		
		
	public:
		
		World();
		~World();
		
		void killing();
		
		void setWorldLimits(const Vector2& min, const Vector2& max);
		
		int addMaterial();
		
		void setMaterialPairCollide(int a, int b, bool collide);
		void setMaterialPairData(int a, int b, float friction, float elasticity);
		void setMaterialPairFilterCallback(int a, int b, CollisionCallback* c);
		
		void addBody( Body* b );
		void removeBody( Body* b );
		Body* getBody( int index );
		
		void getClosestPointMass( const Vector2& pt, int& bodyID, int& pmID );
		Body* getBodyContaining( const Vector2& pt );
		
		void update( float elapsed );
		
	private:
		void updateBodyBitmask( Body* b );
		void sortBodyBoundaries();
		
		void _goNarrowCheck( Body* bI, Body* bJ );
		void bodyCollide( Body* bA, Body* bB, std::vector<BodyCollisionInfo>& infoList );
		void _handleCollisions();

		void _checkAndMoveBoundary( Body::BodyBoundary* bb );
		void _removeBoundary( Body::BodyBoundary* me );
		void _addBoundaryAfter( Body::BodyBoundary* me, Body::BodyBoundary* toAfterMe );
		void _addBoundaryBefore( Body::BodyBoundary* me, Body::BodyBoundary* toBeforeMe );
		
		void _logMaterialCollide();
		void _logBoundaries();
		
	public:			
		
		float getPenetrationThreshold() { return mPenetrationThreshold; }
		void setPenetrationThreshold( float val ) { mPenetrationThreshold = val; }
		
		int getPenetrationCount() { return mPenetrationCount; }
	};
}

#endif	// _WORLD_H








#include "World.h"


namespace JellyPhysics 
{	
	World::~World()
	{
		
		delete[] mMaterialPairs;
	}
										 
	 void World::killing()
	 {
		 // clear up all "VoidMarker" elements in the list...
		 if (mBodies.size() > 0)
		 {
			 Body::BodyBoundary* bb = &mBodies[0]->mBoundStart;
			 
			 while (bb->prev)
				 bb = bb->prev;
			 
			 while (bb)
			 {
				 if (bb->type == Body::BodyBoundary::VoidMarker)
				 {
					 // remove this one!
					 _removeBoundary(bb);
					 Body::BodyBoundary* theNext = bb->next;
					 
					 delete bb;
					 
					 bb = theNext;
					 continue;
				 }
				 
				 bb = bb->next;
			 }
		 }
	 }
		

	

	
	void World::removeBody( Body* b )
	{
#ifdef _DEBUG
		printf("removeBody: %d\n", b);
#endif
		
		std::vector<Body*>::iterator it = mBodies.begin();
		while (it != mBodies.end())
		{
			if ((*it) == b)
			{
				mBodies.erase( it );
				_removeBoundary(&b->mBoundStart);
				_removeBoundary(&b->mBoundEnd);
				
#ifdef _DEBUG
				_logBoundaries();
#endif
				
				break;
			}
			
			it++;
		}
	}
	
	
	

	
	Body* World::getBodyContaining( const Vector2& pt )
	{
		for (unsigned int i = 0; i < mBodies.size(); i++)
		{
			if (mBodies[i]->contains(pt))
				return mBodies[i];
		}
		
		return 0;
	}	

}

*/