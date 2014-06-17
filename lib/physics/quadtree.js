define([], function() {

	/**
	 * QuadTree
	 */
	var QuadTree = function(world, aabb) {
		this.world = world;
		this.root = new Node(this, world, aabb, undefined, undefined, 0, 3, 5);
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
		
		if(this.canSubdivide())
			this.subdivide();
	};
	
	Node.TOP_LEFT = 0;
	Node.TOP_RIGHT = 1;
	Node.BOTTOM_LEFT = 2;
	Node.BOTTOM_RIGHT = 3;
	
	// minimal diagonal length; at which the node is no longer subdivided
	Node.MinLength = 20;
	
	Node.prototype.canSubdivide = function() {
		return this.depth <= this.maxDepth;
		return this.aabb.getSize().length() >= Node.MinLength;
	};
	
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
		this.bodies.length = 0;
		this.numberOfBodies = 0;

		if(this.subdivided) {
			this.childNodes[Node.TOP_LEFT].clear();
			this.childNodes[Node.TOP_RIGHT].clear();
			this.childNodes[Node.BOTTOM_LEFT].clear();
			this.childNodes[Node.BOTTOM_RIGHT].clear();
		}
	};
	
	Node.prototype.processBody = function(body) {
		var newNode = this.trySwim(body).trySink(body);
		
		// assign current node to body
		body.node = newNode;
		
		// assign body to node
		newNode.bodies.push(body);
		newNode.numberOfBodies++;
	};
	
	// checks, whether the body is contained by this node; if not, 
	Node.prototype.trySwim = function(body) {
		if(this === this.root)
			return this;
		if(this.aabb.containsAABB(body.getAABB()))
			return this;
		else
			return this.parent.trySwim(body);
	};
	
	Node.prototype.trySink = function(body) {
		if(this.subdivided) {
			var bodyAABB = body.getAABB();
			var middle = this.aabb.getMiddle();
			// TODO: ease the calculation of child boundaries
			if(bodyAABB.Max.x < middle.x) {
				
			}
			if(bodyAABB.Min.x > middle.x) {
				
			}
			if(this.childNodes[Node.TOP_LEFT].aabb.containsAABB(bodyAABB)) {
				return this.childNodes[Node.TOP_LEFT].trySink(body);
			}
			if(this.childNodes[Node.TOP_RIGHT].aabb.containsAABB(bodyAABB)) {
				return this.childNodes[Node.TOP_RIGHT].trySink(body);
			}
			if(this.childNodes[Node.BOTTOM_LEFT].aabb.containsAABB(bodyAABB)) {
				return this.childNodes[Node.BOTTOM_LEFT].trySink(body);
			}
			if(this.childNodes[Node.BOTTOM_RIGHT].aabb.containsAABB(bodyAABB)) {
				return this.childNodes[Node.BOTTOM_RIGHT].trySink(body);
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
		
		if(this.subdivided) {
			this.childNodes[Node.TOP_LEFT].broadPhaseCollision();
			this.childNodes[Node.TOP_RIGHT].broadPhaseCollision();
			this.childNodes[Node.BOTTOM_LEFT].broadPhaseCollision();
			this.childNodes[Node.BOTTOM_RIGHT].broadPhaseCollision();
		}
		
	};
	
	Node.prototype.callChildCollision = function(body) {
		if(this.subdivided) {
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
		if(this.subdivided) {
			this.childNodes[Node.TOP_LEFT].debugDraw(debugDraw);
			this.childNodes[Node.TOP_RIGHT].debugDraw(debugDraw);
			this.childNodes[Node.BOTTOM_LEFT].debugDraw(debugDraw);
			this.childNodes[Node.BOTTOM_RIGHT].debugDraw(debugDraw);
		}
	};
	
	QuadTree.Node = Node;
	
	return QuadTree;
});
