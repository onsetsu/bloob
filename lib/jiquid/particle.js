Jiquid.Particle = function(){
    this.x = x;
    this.y = y;
    this.u = u;
    this.v = v;
    this.gu = u;
    this.gv = v;

    this.dudx = 0;
    this.dudy = 0;
    this.dvdx = 0;
    this.dvdy = 0;
    this.cx = 0;
    this.cy = 0;
    this.gi = 0;

    this.px = [0,0,0];
    this.py = [0,0,0];
    this.gx = [0,0,0];
    this.gy = [0,0,0];
};
