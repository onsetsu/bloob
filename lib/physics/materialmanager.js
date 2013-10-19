var CollisionCallback = function() {};

CollisionCallback.prototype.collisionFilter = function(bA, bodyApm, bodyB, bodyBpm1, bodyBpm2, hitPt, normalVel) { // Body*, int, Body*, int, int, Vector2, float
	return true;
};

var Material = {
	"Default": 0,
	"Test1": 1,
	"Test2": 2,
	"Test3": 3,
	"Test4": 4,
	"Test5": 5,
	"Test6": 6
	//"Ground": 1,
	//"Slicky": 2
};

var MaterialPair = function() {
	this.Collide = true;
	this.Elasticity = 0.7;
	this.Friction = 0.3;
	this.Callback = new CollisionCallback();
};

var MaterialManager = function() {
	this.mMaterialPairs = []; // MaterialPair*	
	this.mDefaultMatPair = new MaterialPair(); // MaterialPair
	this.mMaterialCount = 0; // int

	// real constructor
	this.mMaterialCount = 1;
	this.mMaterialPairs = [new MaterialPair()];
	this.mDefaultMatPair.Friction = 0.3;
	this.mDefaultMatPair.Elasticity = 0.8;
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