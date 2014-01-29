Jiquid.Material = function(folder) {
	this.stiffness = 1;
	this.restDensity = 1;
	this.bulkViscosity = 1 ;
	this.elasticity = 0;
	this.shearViscosity = 0;
	this.meltRate = 0;
	this.smoothing = 1;
	this.yieldRate = 1;

	folder.open();
	folder.add(this, "restDensity", 0.1, 5.0);
	folder.add(this, "stiffness", 0, 1);
	folder.add(this, "bulkViscosity", 0, 1);
	folder.add(this, "elasticity", 0, 1);
	folder.add(this, "shearViscosity", 0, 1);
	folder.add(this, "meltRate", 0, 1);
	folder.add(this, "smoothing", 0, 1);
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

Jiquid.Material.prototype.setYieldRate = function(yieldRate) {
	this.yieldRate = yieldRate;
	
	return this;
};
