define([
   	"floom/system",
   	"floom/material",
	"floom/particle",
	"floom/node",
	"floom/grid",
	"floom/obstacle",
	"floom/integrator",
	"floom/simulator",
	"floom/tool",
	"physics/jello"
], function(
	System,
	Material,
	Particle,
	Node,
	Grid,
	Obstacle,
	Integrator,
	Simulator,
	Tool,
	Jello
) {
	/*
	 * Early simple implementation of the material point method
	 */
	System.prototype.simpleSimulation = function() {
		this.calculateParticleKernels();
		this.sumParticleDensityFromGridAndAddPressureansElasticForcesToGrid();
		this.divideGridAccelerationByMass();
		this.accelerateParticlesAndInterpolateVelocityBackToGrid();
		this.divideGridVelocityByMass();
		this.advanceParticles();
	};

	System.prototype.calculateParticleKernels = function() {
		// calculate particle kernels, and add density and density gradients to the grid
		_.each(this.particles, function(p, pIndex) {
			this.integrator.updateStateAndGradientOf(p);
			this.integrator.prepareParticle(p);
			
			this.integrator.integrate(p, function(particle, node, phi, gxpy, pxgy) {
				node.mass += phi;
			});
		}, this);
	};
	
	System.prototype.sumParticleDensityFromGridAndAddPressureansElasticForcesToGrid = function() {
		// Sum particle density from grid, and add pressure and elastic forces to grid
		_.each(this.particles, function(p, pIndex) {
	        var density = 0;
			this.integrator.integrate(p, function(particle, node, phi, gxpy, pxgy) {
				density += phi*node.mass;
			});

			var restDensity = p.material.restDensity;
			var pressure = (density-restDensity)/restDensity;
			if (pressure > 4.0)
				pressure = 4.0;

			var f = Jello.Vector2.Zero.copy();
			if (p.position.x < this.wall.Min.x) {
				f.x += this.wall.Min.x - p.position.x;
	            p.velocity.x *= 0.1;
			}
			if (p.position.x > this.wall.Max.x) {
				f.x += this.wall.Max.x - p.position.x;
	            p.velocity.x *= 0.1;
			}
			if (p.position.y < this.wall.Min.y) {
				f.y += this.wall.Min.y - p.position.y;
	            p.velocity.y *= 0.1;
			}
			if (p.position.y > this.wall.Max.y) {
				f.y += this.wall.Max.y - p.position.y;
	            p.velocity.y *= 0.1;
			}
			
			this.integrator.integrate(p, function(particle, node, phi, gxpy, pxgy) {
				node.acceleration.x += -(gxpy * pressure) + f.x * phi;
				node.acceleration.y += -(pxgy * pressure) + f.y * phi;
			});
		}, this);
	};

	// divide grid acceleration by mass
	System.prototype.divideGridAccelerationByMass = function() {
		this.grid.iterate(function(n) {
			if (n.mass > 0.0) {
				n.acceleration.divFloatSelf(n.mass);
				n.acceleration.addSelf(this.gravity);
			}
		}, this);
	};
	
	// accelerate particles and interpolate velocity back to grid
	System.prototype.accelerateParticlesAndInterpolateVelocityBackToGrid = function() {
		_.each(this.particles, function(p, pIndex) {
			this.integrator.integrate(p, function(particle, node, phi, gxpy, pxgy) {
				particle.velocity.addSelf(node.acceleration.mulFloat(phi));
			});
			this.integrator.integrate(p, function(particle, node, phi, gxpy, pxgy) {
				node.velocity.addSelf(particle.velocity.mulFloat(phi));
			});
		}, this);
	};
	
	// divide grid velocity by mass
	System.prototype.divideGridVelocityByMass = function() {
		this.grid.iterate(function(n) {
			if (n.mass > 0.0) {
				n.velocity.divFloatSelf(n.mass);
			}
		}, this);
	};
	
	System.prototype.advanceParticles = function() {
		// advance particles
		_.each(this.particles, function(p, pIndex) {
	        p.gridVelocity.set(Jello.Vector2.Zero);
			this.integrator.integrate(p, function(particle, node, phi, gxpy, pxgy) {
				particle.gridVelocity.addSelf(node.velocity.mulFloat(phi));
			});
			p.position.addSelf(p.gridVelocity);
			p.velocity.addSelf(p.gridVelocity.sub(p.velocity).mulFloat(p.material.smoothing));
		}, this);
	};
});
