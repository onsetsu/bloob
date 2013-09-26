mini.Module(
		"basic/camera"
)
.requires(
		"basic/gui"
)
.defines(function() {
	var Camera = function(canvas, world, height) {
		this.ratio = canvas.canvasWidth / canvas.canvasHeight;
		this.height = height;
		this.width = this.ratio * this.height;
		this.point = Jello.Vector2.Zero.copy();
		console.log(this);
		this.canvas = canvas;
		this.canvasId = canvas.canvasId;
		
		this.scaleX = d3.scale.linear()
			.domain([world.mWorldLimits.Min.x, world.mWorldLimits.Max.x])
			.range([0, canvas.canvasWidth]);
		this.scaleY = d3.scale.linear()
			.domain([world.mWorldLimits.Min.y, world.mWorldLimits.Max.y])
			.range([canvas.canvasHeight, 0]);
	};

	Camera.prototype.update = function() {
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

	Camera.prototype.track = function(body) {
		this.bodyToTrack = body;
		return this;
	};

	Camera.prototype.screenToWorldCoordinates = function(vector) {
		return new Jello.Vector2(
			this.scaleX.invert(vector.x),
			this.scaleY.invert(vector.y)
		);
	};

	Camera.prototype.worldToScreenCoordinates = function(vector) {
		return new Jello.Vector2(
			this.scaleX(vector.x),
			this.scaleY(vector.y)
		);
	};

	Camera.prototype.jumpToPoint = function(vector) {
		this.point.set(vector);
		this.updateScales();
	};

	Camera.prototype.translateBy = function(vector) {
		this.point.addSelf(vector);
		this.updateScales();
	};

	Camera.prototype.updateScales = function() {
		this.scaleX.domain([
			this.point.x - this.width / 2,
			this.point.x + this.width / 2
		]);
		this.scaleY.domain([
			this.point.y - this.height / 2,
			this.point.y + this.height / 2
		]);
	};
	
	Bloob.Camera = Camera;
	
	return Camera;
});
