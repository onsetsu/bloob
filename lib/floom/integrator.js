define(["physics/jello"], function(Jello) {
	var Integrator = function(grid) {
		this.grid = grid;
	};

	Integrator.prototype.updateStateAndGradientOf = function(particle) {
		var p = particle;
		// determine cell index for mesh
		p.cellX = Math.floor(p.position.x - this.grid.boundaries.Min.x - 0.5); // get cell x
		p.cellY = Math.floor(p.position.y - this.grid.boundaries.Min.y - 0.5); // get cell y

		var x = p.cellX - (p.position.x - this.grid.boundaries.Min.x);
		p.px[0] = (0.5 * x * x + 1.5 * x + 1.125);
		p.gx[0] = (x++ + 1.5);
		p.px[1] = (-x * x + 0.75);
		p.gx[1] = (-2.0 * (x++));
		p.px[2] = (0.5 * x * x - 1.5 * x + 1.125);
		p.gx[2] = (x - 1.5);

		var y = p.cellY - (p.position.y - this.grid.boundaries.Min.y);
		p.py[0] = (0.5 * y * y + 1.5 * y + 1.125);
		p.gy[0] = (y++ + 1.5);
		p.py[1] = (-y * y + 0.75);
		p.gy[1] = (-2.0 * (y++));
		p.py[2] = (0.5 * y * y - 1.5 * y + 1.125);
		p.gy[2] = (y - 1.5);

		// using quadratic interpolation
		// indices refer to corresponding adjacent cell
		
		// y  +-+-+-+
		//  2 |4|3|2|
		//    +-+-+-+
		//  1 |5|0|1|
		//    +-+-+-+
		//  0 |6|7|8|
		//    +-+-+-+
		//   /
		//  /  0 1 2 x
		
		// state variable
		p.s[0] = p.px[1] * p.py[1];
		p.s[1] = p.px[2] * p.py[1];
		p.s[2] = p.px[2] * p.py[2];
		p.s[3] = p.px[1] * p.py[2];
		p.s[4] = p.px[0] * p.py[2];
		p.s[5] = p.px[0] * p.py[1];
		p.s[6] = p.px[0] * p.py[0];
		p.s[7] = p.px[1] * p.py[0];
		p.s[8] = p.px[2] * p.py[0];
		
		// gradient in x axis
		p.sx[0] = p.gx[1] * p.py[1];
		p.sx[1] = p.gx[2] * p.py[1];
		p.sx[2] = p.gx[2] * p.py[2];
		p.sx[3] = p.gx[1] * p.py[2];
		p.sx[4] = p.gx[0] * p.py[2];
		p.sx[5] = p.gx[0] * p.py[1];
		p.sx[6] = p.gx[0] * p.py[0];
		p.sx[7] = p.gx[1] * p.py[0];
		p.sx[8] = p.gx[2] * p.py[0];

		// gradient in y axis
		p.sy[0] = p.px[1] * p.gy[1];
		p.sy[1] = p.px[2] * p.gy[1];
		p.sy[2] = p.px[2] * p.gy[2];
		p.sy[3] = p.px[1] * p.gy[2];
		p.sy[4] = p.px[0] * p.gy[2];
		p.sy[5] = p.px[0] * p.gy[1];
		p.sy[6] = p.px[0] * p.gy[0];
		p.sy[7] = p.px[1] * p.gy[0];
		p.sy[8] = p.px[2] * p.gy[0];
	};
	
	// cache the nodes a particle is adjacent to as a particles attribute
	Integrator.prototype.prepareParticle = function(particle) {
		particle.node0 = this.grid.getOrCreateAt(particle.cellX+1, particle.cellY+1);
		particle.node1 = this.grid.getOrCreateAt(particle.cellX+2, particle.cellY+1);
		particle.node2 = this.grid.getOrCreateAt(particle.cellX+2, particle.cellY+2);
		particle.node3 = this.grid.getOrCreateAt(particle.cellX+1, particle.cellY+2);
		particle.node4 = this.grid.getOrCreateAt(particle.cellX,   particle.cellY+2);
		particle.node5 = this.grid.getOrCreateAt(particle.cellX,   particle.cellY+1);
		particle.node6 = this.grid.getOrCreateAt(particle.cellX,   particle.cellY  );
		particle.node7 = this.grid.getOrCreateAt(particle.cellX+1, particle.cellY  );
		particle.node8 = this.grid.getOrCreateAt(particle.cellX+2, particle.cellY  );
	};
	
	Integrator.prototype.integrate = function(particle, fn) {
		fn.call(undefined, particle, particle.node0, particle.s[0], particle.sx[0], particle.sy[0]);
		fn.call(undefined, particle, particle.node1, particle.s[1], particle.sx[1], particle.sy[1]);
		fn.call(undefined, particle, particle.node2, particle.s[2], particle.sx[2], particle.sy[2]);
		fn.call(undefined, particle, particle.node3, particle.s[3], particle.sx[3], particle.sy[3]);
		fn.call(undefined, particle, particle.node4, particle.s[4], particle.sx[4], particle.sy[4]);
		fn.call(undefined, particle, particle.node5, particle.s[5], particle.sx[5], particle.sy[5]);
		fn.call(undefined, particle, particle.node6, particle.s[6], particle.sx[6], particle.sy[6]);
		fn.call(undefined, particle, particle.node7, particle.s[7], particle.sx[7], particle.sy[7]);
		fn.call(undefined, particle, particle.node8, particle.s[8], particle.sx[8], particle.sy[8]);
	};
	
	return Integrator;
});
