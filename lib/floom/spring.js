define([
	"floom/material",
	"floom/particle",
	"floom/group",
	"floom/node",
	"floom/obstacle",
	"floom/simulator",
	"floom/system"
], function(
	Material,
	Particle,
	Group,
	Node,
	Obstacle,
	Simulator,
	System
) {
	var Spring = function(particle1, particle2, restLength) {
		this.particle1 = particle1;
		this.particle2 = particle2;
		this.restLength = restLength;
		this.currentDistance = 0;
	};
	
	Spring.prototype.update = function() {
		this.currentDistance = this.particle1.position
			.sub(this.particle2.length)
			.length();
	};
	
	Spring.prototype.contains = function(particle) {
		return this.particle1 === particle || this.particle2 === particle;
	};
	
	return Spring;
});
