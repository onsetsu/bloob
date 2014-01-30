Jiquid.Particle = function(x, y, u, v){
    this.position = new Jello.Vector2(x, y);
    this.u = u;
    this.v = v;
    this.gu = u;
    this.gv = v;

    this.dudx = 0;
    this.dudy = 0;
    this.dvdx = 0;
    this.dvdy = 0;
    this.cx = 0; // belongs to cell at x
    this.cy = 0; // belongs to cell at y
    this.gi = 0; // grid index

    this.px = [0,0,0];
    this.py = [0,0,0];
    this.gx = [0,0,0];
    this.gy = [0,0,0];
};

Jiquid.Particle.prototype.draw = function(renderer) {
	renderer.drawPolyline([
	    this.position,
	    this.position.sub(new Jello.Vector2(this.gu, this.gv))
	]);
};
