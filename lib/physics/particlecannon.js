ParticleCannon = function() {
	this.store = {};
	this.store.bluePrint = Bloob.BodyFactory.createBluePrint();
};

ParticleCannon.prototype.world = function(world) {
	this.store.world = world;
	return this;
};

ParticleCannon.prototype.bluePrint = function(bluePrint) {
	this.store.bluePrint = bluePrint;
	return this;
};

ParticleCannon.prototype.setFireOptions = function(options) {

};

ParticleCannon.prototype.addToWorld = function(world) {
	world.queue().addParticleCannon(this);
	return this;
};

ParticleCannon.prototype.update = function(timePassed) {
};

//Spawn a new object
ParticleCannon.prototype.fire = function() {
};

ParticleCannon.prototype.debugDraw = function(debugDraw) {
};
