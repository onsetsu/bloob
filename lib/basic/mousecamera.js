Bloob.MouseCamera = function(renderer, logic, world, height) {
	Bloob.Camera.apply(this, arguments);
};

// inheritance
var chain = function() {};
chain.prototype = Bloob.Camera.prototype;
Bloob.MouseCamera.prototype = new chain();
// enable static method inheritance
Bloob.MouseCamera.__proto__ = Bloob.Camera;
Bloob.MouseCamera.prototype.constructor = chain;
Bloob.MouseCamera.prototype.parent = Bloob.Camera.prototype;

Bloob.MouseCamera.prototype.update = function() {
	if(typeof this.bodyToTrack !== "undefined") {
		var direction = this.bodyToTrack.mDerivedPos.sub(this.point);
		var dist = direction.length();
		if(dist > 5)
			this.point.addSelf(direction.mulFloat(
//				0.003 * dist
				0.03 * (dist - 5)
			));
	};
	Bloob.Camera.prototype.update.apply(this, arguments);
};