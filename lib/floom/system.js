define([
	"floom/material",
	"floom/particle",
	"floom/node",
	"floom/grid",
	"floom/integrator",
	"floom/simulator",
	"floom/tool",
	"physics/jello"
], function(Material, Particle, Node, Grid, Integrator, Simulator, Tool, Jello) {
	var System = function() {
		
		this.wall = new Jello.AABB(
			new Jello.Vector2(-50, 2),
			new Jello.Vector2(50, 100)
		);
		this.materials = [];
		this.gravity = new Jello.Vector2(0,-0.05);// 0.004, 0.02
		this.particles = [];
		this.grid = new Grid();
		this.integrator = new Integrator(this.grid);
		this.tool = new Tool(this);
		
		this.materials.push(new Material(0)
			.setRestDensity(1)
			.setSmoothing(0.5));

		this.materials.push(new Material(1)
			.setRestDensity(2)
			.setSmoothing(1.0));

		this.materials.push(new Material(2)
			.setRestDensity(4)
			.setSmoothing(1.0));

		this.materials.push(new Material(3)
			.setRestDensity(8)
			.setSmoothing(1.0));

		this.useSurfaceTensionImplementation = true;
		if(Bloob.debug && Bloob.debug.datGui) {
			var datGui = new dat.GUI();
			datGui.add(this.gravity, "x").min(-0.2).max(0.2).step(-0.01);
			datGui.add(this.gravity, "y").min(-0.2).max(0.2).step(-0.01);
			datGui.add(this, "useSurfaceTensionImplementation");
			
			this.materials[0].addDebugGui(datGui);
			this.materials[1].addDebugGui(datGui);
			this.materials[2].addDebugGui(datGui);
			this.materials[3].addDebugGui(datGui);
		}

	    for (var i = -45; i < 0; i++) {
	        for (var j = 5; j < 25; j++) {
	        	this.particles.push(new Particle(i, j, 0.1, 0, this.materials[0]));
	        }
	    }
	    
	    for (var i = 5; i < 50; i++) {
	        for (var j = 5; j < 25; j++) {
	        	this.particles.push(new Particle(i, j, -0.1, 0, this.materials[1]));
	        }
	    }
	    
	    for (var i = -45; i < 0; i++) {
	        for (var j = 30; j < 50; j++) {
	        	this.particles.push(new Particle(i, j, 0.1, 0, this.materials[2]));
	        }
	    }
	    
	    for (var i = 5; i < 50; i++) {
	        for (var j = 30; j < 50; j++) {
	        	this.particles.push(new Particle(i, j, -0.1, 0, this.materials[3]));
	        }
	    }
	    
		_.each(this.particles, function(p, pIndex) {
			this.integrator.updateStateAndGradientOf(p);
			this.integrator.prepareParticle(p);
		}, this);

	    this.simulator = new Simulator();
	};

	System.prototype.getNumberOfParticles = function() {
		return this.particles.length;
	};

	System.prototype.getNumberOfMaterials = function() {
		return this.materials.length;
	};

	/*
	 * UPDATE
	 */
	System.prototype.update = function() {
		this.tool.update();
		this.grid.update(this);

		if(this.useSurfaceTensionImplementation) {
			this.simulator.update(this);
		} else {
			this.calculateParticleKernels();
			this.sumParticleDensityFromGridAndAddPressureansElasticForcesToGrid();
			this.divideGridAccelerationByMass();
			this.accelerateParticlesAndInterpolateVelocityBackToGrid();
			this.divideGridVelocityByMass();
			this.advanceParticles();
		}
	};
	
	System.prototype.calculateParticleKernels = function() {
		// calculate particle kernels, and add density and density gradients to the grid
		_.each(this.particles, function(p, pIndex) {
			this.integrator.updateStateAndGradientOf(p);
			this.integrator.prepareParticle(p);
			
			this.integrator.integrate(p, function(particle, node, phi, gxpy, pxgy) {
				node.mass += phi;
				node.gx += gxpy;
				node.gy += pxgy;
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
	
	/*
	 * DRAWING
	 */
	System.prototype.draw = function(renderer) {
		// draw grid nodes
		this.grid.draw(renderer);

		// draw mouse cursor
		this.tool.draw();

		// draw all particles in the system
		_.each(this.particles, function(p) {
			p.draw(renderer);
		}, this);
	};
	
	return System;
});
