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
			new Jello.Vector2(50, 50)
		);
		this.materials = [];
		this.gravity = new Jello.Vector2(0,-0.05);// 0.004, 0.02
		this.particles = [];
		this.grid = new Grid();
		this.integrator = new Integrator(this.grid);
		this.tool = new Tool(this);
		this.interaction = "drag";
		
		this.materials.push(new Material()
			.setParticleMass(1)
			.setRestDensity(2)
			.setStiffness(1)
			.setBulkViscosity (1)
			.setElasticity(0)
			.setShearViscosity(0.5)
			.setMeltRate(0.0) // unused
			.setSmoothing(0.5)
			.setYieldPoint(0.1) // unused
			.setYieldRate(0.5));

		this.materials.push(new Material()
			.setParticleMass(1)
			.setRestDensity(8)
			.setStiffness(0.0625)
			.setBulkViscosity (0.5)
			.setElasticity(0.5)
			.setShearViscosity(0.1)
			.setMeltRate(0.0) // unused
			.setSmoothing(1.0)
			.setYieldPoint(0.1) // unused
			.setYieldRate(0.5));

		if(Bloob.debug && Bloob.debug.datGui) {
			this.datGui = new dat.GUI();
			this.datGui.add(this.gravity, "x").min(-0.2).max(0.2).step(-0.01);
			this.datGui.add(this.gravity, "y").min(-0.2).max(0.2).step(-0.01);
			this.datGui.add(this, "interaction", ["drag", "attract", "repel"]);
			
			this.materials[0].addDebugGui(this.datGui.addFolder("Mat1"));
			this.materials[1].addDebugGui(this.datGui.addFolder("Mat2"));
		}

	    for (var i = -50; i < -10; i++) {
	        for (var j = 10; j < 50; j++) {
	        	this.particles.push(new Particle(i, j, 0.1, 0, this.materials[0]));
	        }
	    }
	    
	    for (var i = 0; i < 50; i++) {
	        for (var j = 10; j < 50; j++) {
	        	this.particles.push(new Particle(i, j, -0.1, 0, this.materials[1]));
	        }
	    }
	    
	    
	    this.simulator = new Simulator();
	};

	System.prototype.getNumberOfParticles = function() {
		return this.particles.length;
	};

	/*
	 * UPDATE
	 */
	System.prototype.update = function() {
		this.simulator.update(this);

		this.tool.update();
		
		this.grid.update(this);
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
				node.m += phi;
				node.gx += gxpy;
				node.gy += pxgy;
			});
		}, this);
	};
	
	System.prototype.sumParticleDensityFromGridAndAddPressureansElasticForcesToGrid = function() {
		var loadedMaterial;
		var stiffness,
			restDensity,
			elasticity,
			viscosity,
			elasticityS,
			viscosityS,
			bulkViscosityS;

		// Sum particle density from grid, and add pressure and elastic forces to grid
		_.each(this.particles, function(p, pIndex) {
	        if (p.material != loadedMaterial) {
	            loadedMaterial = p.material;

	            stiffness = loadedMaterial.stiffness;
	            restDensity = loadedMaterial.restDensity;
	            elasticity = loadedMaterial.elasticity;
	            viscosity = loadedMaterial.viscosity;
	            
	            elasticityS = loadedMaterial.elasticity;
	            viscosityS = loadedMaterial.viscosity;
	            bulkViscosityS = loadedMaterial.bulkViscosity;
	        }

	        var density = 0;
			this.integrator.integrate(p, function(particle, node, phi, gxpy, pxgy) {
				density += phi*node.m;
			});

			var pressure = (density-restDensity)/restDensity;
			if (pressure > 4.0)
				pressure = 4.0;

			var fx = 0, fy = 0;
			if (p.position.x < this.wall.Min.x) {
				fx += this.wall.Min.x - p.position.x;
	            p.velocity.x *= 0.1;
			}
			if (p.position.x > this.wall.Max.x) {
				fx += this.wall.Max.x - p.position.x;
	            p.velocity.x *= 0.1;
			}
			if (p.position.y < this.wall.Min.y) {
				fy += this.wall.Min.y - p.position.y;
	            p.velocity.y *= 0.1;
			}
			if (p.position.y > this.wall.Max.y) {
				fy += this.wall.Max.y - p.position.y;
	            p.velocity.y *= 0.1;
			}
			
			this.integrator.integrate(p, function(particle, node, phi, gxpy, pxgy) {
				node.acceleration.x += -(gxpy * pressure) + fx * phi;
				node.acceleration.y += -(pxgy * pressure) + fy * phi;
			});
		}, this);
	};

	// divide grid acceleration by mass
	System.prototype.divideGridAccelerationByMass = function() {
		this.grid.iterate(function(n) {
			if (n.m > 0.0) {
				n.acceleration.divFloatSelf(n.m);
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
			if (n.m > 0.0) {
				n.velocity.divFloatSelf(n.m);
			}
		}, this);
	};
	
	System.prototype.advanceParticles = function() {
		var loadedMaterial = undefined;
		var smoothing,
			yieldRate,
			elastic;
		
		// advance particles
		_.each(this.particles, function(p, pIndex) {
	        if (p.material != loadedMaterial) {
	            loadedMaterial = p.material;

	            smoothing = loadedMaterial.smoothing;
	            yieldRate = loadedMaterial.yieldRate;
	            elastic = loadedMaterial.elasticity > 0;
	        }

	        var gridVelocity = Jello.Vector2.Zero.copy();
			this.integrator.integrate(p, function(particle, node, phi, gxpy, pxgy) {
				gridVelocity.addSelf(node.velocity.mulFloat(phi));
			});
			p.position.addSelf(gridVelocity);
			p.velocity.addSelf(gridVelocity.sub(p.velocity).mulFloat(smoothing));
			p.gridVelocity.set(gridVelocity);
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
