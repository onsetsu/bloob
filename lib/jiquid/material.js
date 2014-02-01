Jiquid.Material = function() {
	this.color = Jiquid.Material.getNextColor();
	
	this.particleMass = 1;
	this.stiffness = 1;
	this.restDensity = 1;
	this.bulkViscosity = 1 ;
	this.elasticity = 0;
	this.shearViscosity = 0;
	this.meltRate = 0;
	this.smoothing = 1;
	this.yieldPoint = 0;
	this.yieldRate = 1;
};

// debug colors
Jiquid.Material.getNextColor = function() {
	return _.sample([
	        '#1f78b4',
	        '#b2df8a',
	        '#33a02c',
	        '#fb9a99',
	        '#e31a1c',
	        '#fdbf6f',
	        '#ff7f00',
	        '#cab2d6',
	        '#6a3d9a',
	        '#ffff99',
	        '#b15928'
	]);
};

// debug properties
Jiquid.Material.prototype.addDebugGui = function(folder) {
	folder.open();
	folder.addColor(this, "color");
	folder.add(this, "particleMass").min(0.01).max(5.0).step(0.1).listen();
	folder.add(this, "restDensity").min(0.1).max(5.0).step(0.1).listen();
	folder.add(this, "stiffness").min(0).max(1).step(0.05).listen();
	folder.add(this, "bulkViscosity").min(0).max(1).step(0.05).listen();
	folder.add(this, "elasticity").min(0).max(1).step(0.05).listen();
	folder.add(this, "shearViscosity").min(0).max(1).step(0.05).listen();
	folder.add(this, "meltRate").min(0).max(1).step(0.05).listen();
	folder.add(this, "smoothing").min(0).max(1).step(0.05).listen();
	
	return this;
};

// Property setters
Jiquid.Material.prototype.setParticleMass = function(stiffness) {
	this.stiffness = stiffness;
	
	return this;
};

Jiquid.Material.prototype.setStiffness = function(stiffness) {
	this.stiffness = stiffness;
	
	return this;
};

Jiquid.Material.prototype.setRestDensity = function(restDensity) {
	this.restDensity = restDensity;
	
	return this;
};

Jiquid.Material.prototype.setBulkViscosity  = function(bulkViscosity) {
	this.bulkViscosity = bulkViscosity ;
	
	return this;
};

Jiquid.Material.prototype.setElasticity = function(elasticity) {
	this.elasticity = elasticity;
	
	return this;
};

Jiquid.Material.prototype.setShearViscosity = function(shearViscosity) {
	this.shearViscosity = shearViscosity;
	
	return this;
};

Jiquid.Material.prototype.setSmoothing = function(smoothing) {
	this.smoothing = smoothing;
	
	return this;
};

Jiquid.Material.prototype.setMeltRate = function(meltRate) {
	this.meltRate = meltRate;
	
	return this;
};

Jiquid.Material.prototype.setYieldPoint = function(yieldPoint) {
	this.yieldPoint = yieldPoint;
	
	return this;
};

Jiquid.Material.prototype.setYieldRate = function(yieldRate) {
	this.yieldRate = yieldRate;
	
	return this;
};
