define([
	"floom/material",
	"floom/particle",
	"floom/node",
	"floom/grid",
	"floom/integrator",
	"floom/tool",
	"physics/jello"
], function(Material, Particle, Node, Grid, Integrator, Tool, Jello) {
	var Simulator = function() {};

	Simulator.prototype.update = function(system) {
		this.surfaceTensionImplementation.call(system);
	};
	
	/*
	 * surface tension implementation
	 */
	Simulator.prototype.surfaceTensionImplementation = function() {
		_.each(this.particles, function(p, pIndex) {
			var material = p.material;
			
			var gVelocity = Jello.Vector2.Zero.copy();
			
			this.integrator.integrate(p, function(particle, node, phi, gxpy, pxgy) {
				gVelocity.addSelf(node.velocity2.mulFloat(phi));
			});
			
			p.position.addSelf(gVelocity);
			p.gridVelocity.set(gVelocity);
			p.velocity.addSelf(gVelocity.sub(p.velocity).mulFloat(material.smoothing));

			// hard boundary correction
			if (p.position.x < this.wall.Min.x - 4) {
				p.position.x = this.wall.Min.x - 4 + .01 * Math.random();
			} else if (p.position.x > this.wall.Max.x + 4) {
				p.position.x = this.wall.Max.x + 4 - .01 * Math.random();
			}
			if (p.position.y < this.wall.Min.y - 4) {
				p.position.y = this.wall.Min.y - 4 + .01 * Math.random();
			} else if (p.position.y > this.wall.Max.y + 4) {
				p.position.y = this.wall.Max.y + 4 - .01 * Math.random();
			}
		}, this);
		
		this.grid.update(this);

		_.each(this.particles, function(p, pIndex) {
			var material = p.material;

			// Update grid cell index and kernel weights
			this.integrator.updateStateAndGradientOf(p);
			this.integrator.prepareParticle(p);

			// Add particle mass, velocity and density gradient to grid
			this.integrator.integrate(p, function(particle, node, phi, gxpy, pxgy) {
				node.m += phi * material.particleMass;
				node.particleDensity += phi;
				node.velocity.addSelf(particle.velocity.mulFloat(material.particleMass * phi));
			});
		}, this);
		
		this.grid.iterate(function(node) {
			if (node.m > 0.0) {
				node.acceleration.set(Jello.Vector2.Zero);
				node.velocity.divFloatSelf(node.m);
			}
		}, this);
		
		// Calculate pressure and add forces to grid
		_.each(this.particles, function(p, pIndex) {
	        var density = 0;
			this.integrator.integrate(p, function(particle, node, phi, gxpy, pxgy) {
				density += phi*node.m;
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

		// Update acceleration of nodes
		this.grid.iterate(function(node) {
			if (node.m > 0.0) {
				node.velocity2.set(Jello.Vector2.Zero);
				node.acceleration.divFloatSelf(node.m);
			}
		}, this);

		this.tool.update();

		_.each(this.particles, function(p, pIndex) {
			var material = p.material;

			// Update particle velocities
			this.integrator.integrate(p, function(particle, node, phi, gxpy, pxgy) {
				particle.velocity.addSelf(node.acceleration.mulFloat(phi));
			});
			
			p.velocity.addSelf(this.gravity);
			p.velocity.mulFloatSelf(1 - material.damping);

			// Add particle velocities back to the grid
			this.integrator.integrate(p, function(particle, node, phi, gxpy, pxgy) {
				node.velocity2.addSelf(particle.velocity.mulFloat(material.particleMass * phi));
			});
		}, this);

		// Update node velocities
		this.grid.iterate(function(node) {
			if (node.m > 0.0) {
				node.velocity2.divFloatSelf(node.m);
				node.m = 0;
				node.particleDensity = 0;
				node.velocity.set(Jello.Vector2.Zero);
			}
		}, this);
	};

	return Simulator;
});
