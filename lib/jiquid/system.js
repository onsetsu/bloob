Jiquid.System = function() {
	
	this.wall = new Jello.AABB(
		new Jello.Vector2(-50, 2),
		new Jello.Vector2(50, 50)
	);
	this.boundaries = new Jello.AABB();
	this.materials = [];
	this.gravity = new Jello.Vector2(0,-0.05);// 0.004, 0.02
	this.particles = [];
	this.grid = [];
	this.gsizeY = 0;
	this.interaction = "drag";
	
	this.materials.push(new Jiquid.Material()
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

	this.materials.push(new Jiquid.Material()
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
        	this.particles.push(new Jiquid.Particle(i, j, 0.1, 0, this.materials[0]));
        }
    }
    
    for (var i = 0; i < 50; i++) {
        for (var j = 10; j < 50; j++) {
        	this.particles.push(new Jiquid.Particle(i, j, -0.1, 0, this.materials[1]));
        }
    }
    
    // expand boundaries to include all particles
    this.boundaries.clear();
    _.each(this.particles, function(p) {
    	this.boundaries.expandToInclude(p.position);
    }, this);

	// expand boundaries a bit further
	this.boundaries.Min.x = Math.floor(this.boundaries.Min.x-1);
	this.boundaries.Min.y = Math.floor(this.boundaries.Min.y-1);
	this.boundaries.Max.x = Math.floor(this.boundaries.Max.x+3);
	this.boundaries.Max.y = Math.floor(this.boundaries.Max.y+3);

    this.simulator = new Jiquid.Simulator();
};

Jiquid.System.prototype.getNumberOfParticles = function() {
	return this.particles.length;
};

Jiquid.System.prototype.update = function() {
	this.simulator.update(this);

	this.handleInteraction();
	
	// clear grid
	this.grid.length = 0;
	this.gsizeY = Math.floor(this.boundaries.Max.y-this.boundaries.Min.y);

	var activeCount = 0;
    
	// calculate particle kernels, and add density and density gradients to the grid
	_.each(this.particles, function(p) {
		// determine cell index for mesh
		p.cx = Math.floor(p.position.x - this.boundaries.Min.x - 0.5); // get cell x
		p.cy = Math.floor(p.position.y - this.boundaries.Min.y - 0.5); // get cell y
		p.gridIndex = p.cx * this.gsizeY + p.cy;

		var x = p.cx - (p.position.x - this.boundaries.Min.x);
		p.px[0] = (0.5 * x * x + 1.5 * x + 1.125);
		p.gx[0] = (x++ + 1.5);
		p.px[1] = (-x * x + 0.75);
		p.gx[1] = (-2.0 * (x++));
		p.px[2] = (0.5 * x * x - 1.5 * x + 1.125);
		p.gx[2] = (x - 1.5);

		var y = p.cy - (p.position.y - this.boundaries.Min.y);
		p.py[0] = (0.5 * y * y + 1.5 * y + 1.125);
		p.gy[0] = (y++ + 1.5);
		p.py[1] = (-y * y + 0.75);
		p.gy[1] = (-2.0 * (y++));
		p.py[2] = (0.5 * y * y - 1.5 * y + 1.125);
		p.gy[2] = (y - 1.5);

		for (var i = 0; i < 3; i++) {
			var ga = p.gridIndex+i*this.gsizeY;
            var pxi = p.px[i];
            var pgxi = p.gx[i];
			for (var j = 0; j < 3; j++) {
				var gaj = ga+j;
				var n = this.grid[gaj];
				if (n === undefined) {
                    this.grid[gaj] = n = new Jiquid.Node();
                    activeCount++;
				}
				phi = pxi * p.py[j];
				n.m += phi;
				n.gx += pgxi * p.py[j];
				n.gy += pxi * p.gy[j];
			}
		}
	}, this);

	var loadedMaterial;
	var stiffness,
		restDensity,
		elasticity,
		viscosity,
		elasticityS,
		viscosityS,
		bulkViscosityS;

	// Sum particle density from grid, and add pressure and elastic forces to grid
	_.each(this.particles, function(p) {
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
		for (var i = 0; i < 3; i++) {
			var ga = p.gridIndex+i*this.gsizeY;
            var pxi = p.px[i];
			for (var j = 0; j < 3; j++) {
				var n = this.grid[ga+j];
				var phi = pxi * p.py[j];
				density += phi*n.m;
			}
		}
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

		for (var i = 0; i < 3; i++) {
			var ga = p.gridIndex+i*this.gsizeY;
            var pxi = p.px[i];
            var gxi = p.gx[i];
			for (var j = 0; j < 3; j++) {
				var n = this.grid[ga+j];
				phi = pxi * p.py[j];
				n.acceleration.x += -((gxi * p.py[j]) * pressure) + fx * phi;
				n.acceleration.y += -((pxi * p.gy[j]) * pressure) + fy * phi;
			}
		}
	}, this);

    // divide grid acceleration by mass
	_.each(this.grid, function(n) {
		if (n.m > 0.0) {
			n.acceleration.divFloatSelf(n.m);
			n.acceleration.addSelf(this.gravity);
		}
	}, this);

	// accelerate particles and interpolate velocity back to grid
	_.each(this.particles, function(p) {
		for (var i = 0; i < 3; i++) {
			var ga = p.gridIndex+i*this.gsizeY;
            var pxi = p.px[i];
			for (var j = 0; j < 3; j++) {
				var n = this.grid[ga+j];
				phi = pxi * p.py[j];
				p.velocity.addSelf(n.acceleration.mulFloat(phi));
			}
		}
		for (var i = 0; i < 3; i++) {
			var ga = p.gridIndex+i*this.gsizeY;
            var pxi = p.px[i];
			for (var j = 0; j < 3; j++) {
				var n = this.grid[ga+j];
				phi = pxi * p.py[j];
				n.velocity.addSelf(p.velocity.mulFloat(phi));
			}
		}
	}, this);

	// divide grid velocity by mass
	_.each(this.grid, function(n) {
		if (n.m > 0.0) {
			n.velocity.divFloatSelf(n.m);
		}
	}, this);

	this.boundaries.clear();
	
	loadedMaterial = undefined;
	var smoothing,
		yieldRate,
		elastic;
	
	// advance particles
	_.each(this.particles, function(p) {
        if (p.material != loadedMaterial) {
            loadedMaterial = p.material;

            smoothing = loadedMaterial.smoothing;
            yieldRate = loadedMaterial.yieldRate;
            elastic = loadedMaterial.elasticity > 0;
        }

        var gridVelocity = Jello.Vector2.Zero.copy();
		for (i = 0; i < 3; i++) {
			var ga = p.gridIndex+i*this.gsizeY;
            var pxi = p.px[i];
			for (j = 0; j < 3; j++) {
				var n = this.grid[ga+j];
				phi = pxi * p.py[j];
				gridVelocity.addSelf(n.velocity.mulFloat(phi));
			}
		}
		p.position.addSelf(gridVelocity);
		p.velocity.addSelf(gridVelocity.sub(p.velocity).mulFloat(smoothing));
		p.gridVelocity.set(gridVelocity);
		
	    // expand boundaries to include all particles
		this.boundaries.expandToInclude(p.position);
	}, this);

	// expand boundaries a bit further
	this.boundaries.Min.x = Math.floor(this.boundaries.Min.x-1);
	this.boundaries.Min.y = Math.floor(this.boundaries.Min.y-1);
	this.boundaries.Max.x = Math.floor(this.boundaries.Max.x+3);
	this.boundaries.Max.y = Math.floor(this.boundaries.Max.y+3);
};

// simple interaction techniques
Jiquid.System.prototype.handleInteraction = function() {
	this.interactionLastPoint = this.interactionCurrentPoint || env.camera.screenToWorldCoordinates(env.input.mouse);
	this.interactionCurrentPoint = env.camera.screenToWorldCoordinates(env.input.mouse);

	if(env.input.state(env.game.LeftButton) || env.input.state(env.game.RightButton) || env.input.state("up")) {
		// drag
		if(env.input.state(env.game.LeftButton))
			_.each(this.particles, function(p) {
				if(p.position.sub(this.interactionCurrentPoint).lengthSquared() < 50)
					p.velocity.lerpSelf(this.interactionCurrentPoint.sub(this.interactionLastPoint), 0.2);
			}, this);
		else if(env.input.state(env.game.RightButton)) {
			// attract
			_.each(this.particles, function(p) {
				var vectorToMouse = this.interactionCurrentPoint.sub(p.position);
				var distanceToMouse = vectorToMouse.lengthSquared();
				if(distanceToMouse < 50)
					p.velocity.addSelf(vectorToMouse
							.mulFloat(1/distanceToMouse)
							.mulFloat((Math.log(1+distanceToMouse)))
							);
			}, this);
		} else if(env.input.state("up")) {
			// repel
			_.each(this.particles, function(p) {
				var vectorToMouse = this.interactionCurrentPoint.sub(p.position);
				var distanceToMouse = vectorToMouse.lengthSquared();
				if(distanceToMouse < 50)
					p.velocity.addSelf(vectorToMouse
							//.mulFloat(0.1)
							.mulFloat(0.1 * Math.log(1/(1+distanceToMouse)))
							);
			}, this);
		}
	} else {
		this.interactionLastPoint = undefined;
		this.interactionCurrentPoint = undefined;
	};
};

Jiquid.System.prototype.draw = function(renderer) {
	this.boundaries.debugDraw(renderer);

	env.renderer.setOptions({color: "pink", opacity: 0.5});
	env.renderer.drawDot(env.camera.screenToWorldCoordinates(env.input.mouse), 10);

	// draw all particles in the system
	_.each(this.particles, function(p) {
		p.draw(renderer);
	}, this);
};
