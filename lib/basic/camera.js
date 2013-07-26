Bloob.Camera = function(renderer, logic, world, height) {
	this.ratio = renderer.canvasWidth / renderer.canvasHeight;
	this.height = height;
	this.width = this.ratio * this.height;
	this.point = Vector2.Zero.copy();
	Scarlet.log(this);
	this.renderer = renderer;
	logic.addCamera(this);
};

Bloob.Camera.prototype.update = function() {
	if(typeof this.bodyToTrack !== "undefined") {
		var direction = this.bodyToTrack.mDerivedPos.sub(this.point);
		var dist = direction.length();
		if(dist > 5)
			this.point.addSelf(direction.mulFloat(
//				0.003 * dist
				0.03 * (dist - 5)
			));
	};
	this.renderer.scaleX.domain([this.point.x - this.width / 2, this.point.x + this.width / 2]);
	this.renderer.scaleY.domain([this.point.y - this.height / 2, this.point.y + this.height / 2]);
};