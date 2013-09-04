Bloob.Camera = function(canvas, logic, world, height) {
	this.ratio = canvas.canvasWidth / canvas.canvasHeight;
	this.height = height;
	this.width = this.ratio * this.height;
	this.point = Vector2.Zero.copy();
	Scarlet.log(this);
	this.canvas = canvas;
	this.canvasId = canvas.canvasId;
	logic.addCamera(this);
	
	this.scaleX = d3.scale.linear()
		.domain([world.mWorldLimits.Min.x, world.mWorldLimits.Max.x])
		.range([0, canvas.canvasWidth]);
	this.scaleY = d3.scale.linear()
		.domain([world.mWorldLimits.Min.y, world.mWorldLimits.Max.y])
		.range([canvas.canvasHeight, 0]);
};

Bloob.Camera.prototype.update = function() {
	if(typeof this.bodyToTrack !== "undefined") {
		var direction = this.bodyToTrack.mDerivedPos.sub(this.point);
		var dist = direction.length();
		if(dist > 5)
			this.point.addSelf(direction.mulFloat(
				0.03 * (dist - 5)
			));
	};
	
	// Update frame to print in renderer.
	this.jumpToPoint(this.point);
};

Bloob.Camera.prototype.track = function(body) {
	this.bodyToTrack = body;
	return this;
};

Bloob.Camera.prototype.screenToWorldCoordinates = function(vector) {
	return new Vector2(
		this.scaleX.invert(vector.x),
		this.scaleY.invert(vector.y)
	);
};

Bloob.Camera.prototype.worldToScreenCoordinates = function(vector) {
	return new Vector2(
		this.scaleX(vector.x),
		this.scaleY(vector.y)
	);
};

Bloob.Camera.prototype.jumpToPoint = function(vector) {
	this.scaleX.domain([
		vector.x - this.width / 2,
		vector.x + this.width / 2
	]);
	this.scaleY.domain([
		vector.y - this.height / 2,
		vector.y + this.height / 2
	]);
};
