define([], function() {

	/**
	 * QuadTree
	 */
	var QuadTree = function(world, aabb) {
		this.world = world;
		this.root = new Node(this, world, aabb, undefined, undefined, 0, 5, 5);
	};
	
	QuadTree.prototype.clear = function() {
		return this.root.clear();
	};
	
	QuadTree.prototype.addBody = function(body) {
		body.node = this.root;
	};
	
	QuadTree.prototype.removeBody = function(body) {
		body.node = undefined;
	};
	
	QuadTree.prototype.processBody = function(body) {
		body.node.processBody(body);
	};
	
	QuadTree.prototype.broadPhaseCollision = function() {
		this.root.broadPhaseCollision();
	};
	
	QuadTree.prototype.debugDraw = function(debugDraw) {
		this.root.debugDraw(debugDraw);
	};
	
	/**
	 * Node
	 */
	var Node = function(quadTree, world, aabb, parent, root, depth, maxDepth, maxBodies) {
		this.quadTree = quadTree;
		this.world = world;
		this.aabb = aabb;
		
		this.parent = parent;
		this.root = root || this;
		this.childNodes = [];
		this.subdivided = false;
		
		this.bodies = [];
		this.numberOfBodies = 0;
		
		this.depth = depth;
		this.maxDepth = maxDepth;
		this.maxBodies = maxBodies;
		
		if(this.depth <= this.maxDepth)
			this.subdivide();
		this.useChildNodes = false;
	};
	
	Node.TOP_LEFT = 0;
	Node.TOP_RIGHT = 1;
	Node.BOTTOM_LEFT = 2;
	Node.BOTTOM_RIGHT = 3;
	
	Node.prototype.subdivide = function() {
		this.subdivided = true;

		// create child nodes
		var childAABBs = this.aabb.subdivide();
		this.childNodes[Node.TOP_LEFT] = new Node(this.quadTree, this.world, childAABBs[0], this, this.root, this.depth + 1, this.maxDepth, this.maxBodies);
		this.childNodes[Node.TOP_RIGHT] = new Node(this.quadTree, this.world, childAABBs[1], this, this.root, this.depth + 1, this.maxDepth, this.maxBodies);
		this.childNodes[Node.BOTTOM_LEFT] = new Node(this.quadTree, this.world, childAABBs[2], this, this.root, this.depth + 1, this.maxDepth, this.maxBodies);
		this.childNodes[Node.BOTTOM_RIGHT] = new Node(this.quadTree, this.world, childAABBs[3], this, this.root, this.depth + 1, this.maxDepth, this.maxBodies);
	};
	
	Node.prototype.clear = function() {
		var accumulatedBodies = 0;
		if(this.useChildNodes && this.subdivided) {
			// add #bodies of childs to accumulated bodies;
			accumulatedBodies += this.childNodes[Node.TOP_LEFT].clear();
			accumulatedBodies += this.childNodes[Node.TOP_RIGHT].clear();
			accumulatedBodies += this.childNodes[Node.BOTTOM_LEFT].clear();
			accumulatedBodies += this.childNodes[Node.BOTTOM_RIGHT].clear();
		}

		accumulatedBodies += this.numberOfBodies;
		
		if(accumulatedBodies < this.maxBodies) {
			this.useChildNodes = false;
		}

		this.bodies.length = 0;
		this.numberOfBodies = 0;
		
		return accumulatedBodies;
	};
	
	Node.prototype.processBody = function(body) {
		this
			.trySwim(body)
			.trySink(body)
			.assignToBody(body);
	};

	Node.prototype.assignToBody = function(body) {
		// assign current node to body
		body.node = this;
		
		// assign body to node
		this.bodies.push(body);
		this.numberOfBodies++;
	};

	// checks, whether the body is contained by this node; if not, 
	Node.prototype.trySwim = function(body) {
		if(this === this.root)
			return this;
		if(!this.parent.useChildNodes)
			return this.parent.trySwim(body);
		if(this.aabb.containsAABB(body.getAABB()))
			return this;
		else
			return this.parent.trySwim(body);
	};
	
	Node.prototype.trySink = function(body) {
		if(!this.subdivided) return this;
		if(this.useChildNodes) {
			var bodyAABB = body.getAABB();
			var middle = this.aabb.getMiddle();
			// TODO: ease the calculation of child boundaries
			if(bodyAABB.Max.x < middle.x) {
				// top
				if(bodyAABB.Max.y < middle.y) {
					// left
					return this.childNodes[Node.TOP_LEFT].trySink(body);
				} else if(bodyAABB.Min.y > middle.y) {
					// right
					return this.childNodes[Node.TOP_RIGHT].trySink(body);
				}
			} else if(bodyAABB.Min.x > middle.x) {
				// bottom
				if(bodyAABB.Max.y < middle.y) {
					// left
					return this.childNodes[Node.BOTTOM_LEFT].trySink(body);
				} else if(bodyAABB.Min.y > middle.y) {
					// right
					return this.childNodes[Node.BOTTOM_RIGHT].trySink(body);
				}
			}
		} else {
			if(this.numberOfBodies > this.maxBodies) {
				this.useChildNodes = true;

				var bodiesToSink = this.bodies;

				this.bodies = [];
				this.numberOfBodies = 0;
				
				for(var i = 0; i < bodiesToSink.length; i++) {
					var temp = bodiesToSink[i];
					this
						.trySink(temp)
						.assignToBody(temp);
				}
				
				return this.trySink(body);
			}
		}
		return this;
	};
	
	Node.prototype.broadPhaseCollision = function() {
		for (var i = 0; i < this.bodies.length; i++) {
			var bA = this.bodies[i];
			if (bA.getIsStatic() || bA.getIgnoreMe())
				continue;
			for (var j = i+1; j < this.bodies.length; j++) {
				this.world._goNarrowCheck(bA, this.bodies[j]);
			}

			this.callChildCollision(bA);
		}
		
		if(this.useChildNodes && this.subdivided) {
			this.childNodes[Node.TOP_LEFT].broadPhaseCollision();
			this.childNodes[Node.TOP_RIGHT].broadPhaseCollision();
			this.childNodes[Node.BOTTOM_LEFT].broadPhaseCollision();
			this.childNodes[Node.BOTTOM_RIGHT].broadPhaseCollision();
		}
		
	};
	
	Node.prototype.callChildCollision = function(body) {
		if(this.useChildNodes && this.subdivided) {
			this.childNodes[Node.TOP_LEFT].childCollision(body);
			this.childNodes[Node.TOP_RIGHT].childCollision(body);
			this.childNodes[Node.BOTTOM_LEFT].childCollision(body);
			this.childNodes[Node.BOTTOM_RIGHT].childCollision(body);
		}
	};
	
	Node.prototype.childCollision = function(body) {
		for (var i = 0; i < this.bodies.length; i++) {
			this.world._goNarrowCheck(body, this.bodies[i]);
		}

		this.callChildCollision(body);
	};
	
	Node.shouldDraw = false;
	
	Node.prototype.debugDraw = function(debugDraw) {
		if(!Node.shouldDraw) return;
		
		this.aabb.debugDraw(debugDraw);
		debugDraw.drawTextWorld(
			"" + this.numberOfBodies,
			this.aabb.getMiddle(),
			"red",
			0.8,
			"top"
		);
		if(this.useChildNodes && this.subdivided) {
			this.childNodes[Node.TOP_LEFT].debugDraw(debugDraw);
			this.childNodes[Node.TOP_RIGHT].debugDraw(debugDraw);
			this.childNodes[Node.BOTTOM_LEFT].debugDraw(debugDraw);
			this.childNodes[Node.BOTTOM_RIGHT].debugDraw(debugDraw);
		}
	};
	
	QuadTree.Node = Node;
	
	return QuadTree;
});
