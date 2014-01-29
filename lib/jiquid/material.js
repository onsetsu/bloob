Jiquid.Material = function() {
	
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

Jiquid.Material.prototype.setViscosity = function(viscosity) {
	this.viscosity = viscosity;
	
	return this;
};

Jiquid.Material.prototype.setSmoothing = function(smoothing) {
	this.smoothing = smoothing;
	
	return this;
};

Jiquid.Material.prototype.setYieldRate = function(yieldRate) {
	this.yieldRate = yieldRate;
	
	return this;
};
