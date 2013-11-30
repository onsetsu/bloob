var CollisionCallback = function() {};

CollisionCallback.prototype.collisionFilter = function(bA, bodyApm, bodyB, bodyBpm1, bodyBpm2, hitPt, normalVel) { // Body*, int, Body*, int, int, Vector2, float
	return true;
};

var Material = function(friction, elasticity) {
	this.friction = friction;
	this.elasticity = elasticity;
	this.combineFriction = Material.combine.average;
	this.combineElasticity = Material.combine.average;
};

// Define getter and setter functions for essential properties.
Material.prototype.setFriction = function(friction) { this.friction = friction; };
Material.prototype.getFriction = function() { return this.friction; };
Material.prototype.setElasticity = function(elasticity) { this.elasticity = elasticity; };
Material.prototype.getElasticity = function() { return this.elasticity; };
Material.prototype.setCombineFriction = function(combineFriction) { this.combineFriction = combineFriction; };
Material.prototype.getCombineFriction = function() { return this.combineFriction; };
Material.prototype.setCombineElasticity = function(combineElasticity) { this.combineElasticity = combineElasticity; };
Material.prototype.getCombineElasticity = function() { return this.combineElasticity; };

// Standard functions to combine friction or elaticity values of two colliding bodies.
Material.combine = {
	average: function(own, other) { return (own + other) / 2; },
	minimum: function(own, other) { return Math.min(own, other); },
	maximum: function(own, other) { return Math.max(own, other); },
	multiply: function(own, other) { return own * other; },
	own: function(own, other) { return own; },
	other: function(own, other) { return other; },
	fValue: function(own, other) { return 2 * own * other / (own + other); }
};

Material.Default = new Material();
Material.Default.setFriction(1);
Material.Default.setElasticity(0);

Material.Test1 = 1;
Material.Test2 = 2;
Material.Test3 = 3;
Material.Test4 = 4;
Material.Test5 = 5;
Material.Test6 = 6;
//Material.Ground = 1;
//Material.Slicky = 2;

var MaterialPair = function() {
	this.Collide = true;
	this.Elasticity = 0.0;
	this.Friction = 1.0;
	this.Callback = new CollisionCallback();
};

var MaterialManager = function() {
	this.mMaterialPairs = []; // MaterialPair*	
	this.mDefaultMatPair = new MaterialPair(); // MaterialPair
	this.mMaterialCount = 0; // int

	// real constructor
	this.mMaterialCount = 1;
	this.mMaterialPairs = [new MaterialPair()];
	this.mDefaultMatPair.Friction = 1.0;
	this.mDefaultMatPair.Elasticity = 0.0;
	this.mDefaultMatPair.Collide = true;

	this.mMaterialPairs[0] = this.mDefaultMatPair;
	
	this.mMaterialPairs = {};
	this.addMaterial(Material.Default);
};

MaterialManager.prototype.getMaterialPair = function(materialA, materialB) {
	return this.mMaterialPairs[materialA][materialB];
	return this.mMaterialPairs[(materialA * this.mMaterialCount) + materialB];
};

MaterialManager.prototype.addMaterial = function(material)
{
	this.mMaterialCount++;
	
	for(mat in this.mMaterialPairs) {
		this.mMaterialPairs[mat][material] = new MaterialPair();
	};

	this.mMaterialPairs[material] = {};
	this.mMaterialPairs[material][material] = new MaterialPair();
	
	for(mat in this.mMaterialPairs) {
		this.mMaterialPairs[material][mat] = this.mMaterialPairs[mat][material];
	};
};

MaterialManager.prototype.setMaterialPairCollide = function(materialA, materialB, collide) {
	this.mMaterialPairs[materialA][materialB].Collide = collide;
	this.mMaterialPairs[materialB][materialA].Collide = collide;
};

MaterialManager.prototype.setMaterialPairData = function(materialA, materialB, friction, elasticity) {
	this.mMaterialPairs[materialA][materialB].Friction = friction;
	this.mMaterialPairs[materialA][materialB].Elasticity = elasticity;

	this.mMaterialPairs[materialB][materialA].Friction = friction;
	this.mMaterialPairs[materialB][materialA].Elasticity = elasticity;
};

MaterialManager.prototype.setMaterialPairFilterCallback = function(materialA, materialB, collisionCallback) {
	this.mMaterialPairs[materialB][materialA].Callback = collisionCallback;
	this.mMaterialPairs[materialA][materialB].Callback = collisionCallback;
};

MaterialManager.prototype.getMaterialCount = function() { return this.mMaterialCount; };