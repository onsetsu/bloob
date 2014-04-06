define(["physics/jello"], function(Jello) {
	var Particle = function(x, y, u, v, material){
	    this.position = new Jello.Vector2(x, y);
	    this.velocity = new Jello.Vector2(u, v);
	    // velocity gathered by the filter over the grid
	    this.gridVelocity = this.velocity.copy(); // or gradient x, y????

	    this.material = material;
	    
	    this.cellX = 0; // belongs to cell at x
	    this.cellY = 0; // belongs to cell at y

	    this.px = [0,0,0]; // deformation gradient?
	    this.py = [0,0,0];
	    this.gx = [0,0,0];
	    this.gy = [0,0,0];
	};

	Particle.prototype.draw = function(renderer) {
		renderer.setOptions({
			color: this.material.colorScale(this.velocity.lengthSquared())
		});
		
		renderer.drawPolyline([
		    this.position,
		    this.position.sub(this.gridVelocity)
		]);
	};
	
	return Particle;
});
