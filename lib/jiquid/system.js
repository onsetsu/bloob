var gsizeY;

Jiquid.System = function(layer, world) {
	
	this.boundaries = new Jello.AABB();
	this.materials = [];
	//this.gravity = Jello.Vector2(0, -9.81); // 0.004, 0.02
	this.particles = [];
	this.grid = [];
	this.gravity = -0.05;
	
	this.datGui = new dat.GUI();
	this.datGui.add(this, "gravity", 0, 0.2);
	
	this.materials.push(new Jiquid.Material(this.datGui.addFolder("Mat1"))
		.setStiffness(0.5)
		.setRestDensity(2.5)
		.setBulkViscosity (3.0)
		.setElasticity(1.0)
		.setShearViscosity(1.0)
		.setMeltRate(0.0)
		.setSmoothing(1.0)
		.setYieldRate(1.0));

    for (var i = 10; i < 50; i++) {
        for (var j = 10; j < 50; j++) {
        	this.particles.push(new Jiquid.Particle(i, j, 0.1, 0));
        }
    }
    
    // expand boundaries to include all particles
    this.boundaries.clear();
    this.boundaries.expandToInclude(this.particles[0].position);
	for (var i = 0, il = this.particles.length; i < il; i++) {
	    this.boundaries.expandToInclude(this.particles[i].position);
	}

	// expand boundaries a bit further
	this.boundaries.Min.x = Math.floor(this.boundaries.Min.x-1);
	this.boundaries.Min.y = Math.floor(this.boundaries.Min.y-1);
	this.boundaries.Max.x = Math.floor(this.boundaries.Max.x+3);
	this.boundaries.Max.y = Math.floor(this.boundaries.Max.y+3);

    this.simulator = new Jiquid.Simulator();
};

Jiquid.System.prototype.update = function() {
	this.simulator.update(this);

	// clear grid
	this.grid.length = 0;
	gsizeY = Math.floor(this.boundaries.Max.y-this.boundaries.Min.y);

	var activeCount = 0;
    
    // iterate all particles
	for (var pi = 0, il = this.particles.length; pi < il; pi++) {
		var p = this.particles[pi];
		p.cx = Math.floor(p.position.x - this.boundaries.Min.x - 0.5);
		p.cy = Math.floor(p.position.y - this.boundaries.Min.y - 0.5);
		p.gi = p.cx * gsizeY + p.cy;

		var x = p.cx - (p.position.x-this.boundaries.Min.x);
		p.px[0] = (0.5 * x * x + 1.5 * x + 1.125);
		p.gx[0] = (x++ + 1.5);
		p.px[1] = (-x * x + 0.75);
		p.gx[1] = (-2.0 * (x++));
		p.px[2] = (0.5 * x * x - 1.5 * x + 1.125);
		p.gx[2] = (x - 1.5);

		var y = p.cy - (p.position.y-this.boundaries.Min.y);
		p.py[0] = (0.5 * y * y + 1.5 * y + 1.125);
		p.gy[0] = (y++ + 1.5);
		p.py[1] = (-y * y + 0.75);
		p.gy[1] = (-2.0 * (y++));
		p.py[2] = (0.5 * y * y - 1.5 * y + 1.125);
		p.gy[2] = (y - 1.5);

		for (var i = 0; i < 3; i++) {
			var ga = p.gi+i*gsizeY;
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
	}

    // iterate all particles
	for (var pi = 0, il = this.particles.length; pi < il; pi++) {
		var p = this.particles[pi];
		var density = 0;
		for (var i = 0; i < 3; i++) {
			var ga = p.gi+i*gsizeY;
            var pxi = p.px[i];
			for (var j = 0; j < 3; j++) {
				var n = this.grid[ga+j];
				var phi = pxi * p.py[j];
				density += phi*n.m;
			}
		}
		var pressure = (density-this.materials[0].restDensity)/this.materials[0].restDensity;
		if (pressure > 4.0)
			pressure = 4.0;

		var fx = 0, fy = 0;
		if (p.position.x<2) {
			fx += 2-p.position.x;
            p.u *= 0.1;
		}
		if (p.position.y<2) {
			fy += 2-p.position.y;
            p.v *= 0.1;
		}

		for (var i = 0; i < 3; i++) {
			var ga = p.gi+i*gsizeY;
            var pxi = p.px[i];
            var gxi = p.gx[i];
			for (var j = 0; j < 3; j++) {
				var n = this.grid[ga+j];
				phi = pxi * p.py[j];
				n.ax += -((gxi * p.py[j]) * pressure) + fx * phi;
				n.ay += -((pxi * p.gy[j]) * pressure) + fy * phi;
			}
		}
	}

    // iterate all grid cells
	for (var i in this.grid) {
		var n = this.grid[i];
		if (n.m > 0.0) {
			n.ax /= n.m;
			n.ay /= n.m;
			//n.ay += this.gravity;
		}
	}

	// iterate all particles
	for (var pi = 0, il = this.particles.length; pi < il; pi++) {
		var p = this.particles[pi];
		for (var i = 0; i < 3; i++) {
			var ga = p.gi+i*gsizeY;
            var pxi = p.px[i];
			for (var j = 0; j < 3; j++) {
				var n = this.grid[ga+j];
				phi = pxi * p.py[j];
				p.u += phi*n.ax;
				p.v += phi*n.ay;
			}
		}
		for (var i = 0; i < 3; i++) {
			var ga = p.gi+i*gsizeY;
            var pxi = p.px[i];
			for (var j = 0; j < 3; j++) {
				var n = this.grid[ga+j];
				phi = pxi * p.py[j];
				n.u += phi*p.u;
				n.v += phi*p.v;
			}
		}
	}

    // iterate all grid cells
	for (var i in this.grid) {
		var n = this.grid[i];
		if (n.m > 0.0) {
			n.u /= n.m;
			n.v /= n.m;
		}
	}

	this.boundaries.clear();
	this.boundaries.expandToInclude(this.particles[0].position);
	
	// iterate all particles
	for (var pi = 0, il = this.particles.length; pi < il; pi++) {
		var p = this.particles[pi];
		var gu = 0, gv = 0;
		for (i = 0; i < 3; i++) {
			var ga = p.gi+i*gsizeY;
            var pxi = p.px[i];
			for (j = 0; j < 3; j++) {
				var n = this.grid[ga+j];
				phi = pxi * p.py[j];
				gu += phi*n.u;
				gv += phi*n.v;
			}
		}
		p.position.x += gu;
		p.position.y += gv;
		p.u += this.materials[0].smoothing*(gu-p.u);
		p.v += this.materials[0].smoothing*(gv-p.v);
		p.gu = gu;
		p.gv = gv;

	    // expand boundaries to include all particles
		this.boundaries.expandToInclude(p.position);
	}

	// expand boundaries a bit further
	this.boundaries.Min.x = Math.floor(this.boundaries.Min.x-1);
	this.boundaries.Min.y = Math.floor(this.boundaries.Min.y-1);
	this.boundaries.Max.x = Math.floor(this.boundaries.Max.x+3);
	this.boundaries.Max.y = Math.floor(this.boundaries.Max.y+3);
};

Jiquid.System.prototype.draw = function(renderer) {
	// draw all particles in the system
	for(var i = 0; i < this.particles.length; i++)
		this.particles[i].draw(renderer);
};
