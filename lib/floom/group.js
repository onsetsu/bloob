define(["floom/particle", "floom/material", "physics/jello"], function(Particle, Material, Jello) {
	var Group = function(system, minX, minY, maxX, maxY, u, v, material) {
		this.material = material;
		
		for (var i = minX; i < maxX; i++)
	        for (var j = minY; j < maxY; j++)
	        	system.addParticle(new Particle(i, j, u, v, material));
	};
	
	return Group;
});
