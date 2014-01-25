mini.Module(
	"behaviour/traits/showcase/movingground"
)
.requires(
	"behaviour/trait"
)
.defines(function (Trait) {
	Trait.Repository.add("showcase/movingground", function(entity) {
		// lazy initialization
		if(!this.initialized) {
			this.initialized = true;
			this.movementVector = new Jello.Vector2(-0.1, 0);
			this.counter = 300;
		}
		
		// invert movementVector after some time
		this.counter++;
		if(this.counter > 1000) {
			this.movementVector.mulFloatSelf(-1);
			this.counter = 0;
		}

		var body = entity.getBody();
		var pointMassCount = body.getPointMassCount();
		// update by translating all PointMasses
		for(var i = 0; i < pointMassCount; i++) {
			var pointMass = body.getPointMass(i);
			pointMass.Position.addSelf(this.movementVector);
		}
	});
});
