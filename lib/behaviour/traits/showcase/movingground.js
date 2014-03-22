define([
	"behaviour/trait",
	"behaviour/traits/itrait",
	"physics/jello"
], function (Trait, ITrait, Jello) {

	var movingGround = ITrait.subclass({
		initialize: function() {
			// TODO: make this time-independent
			this.movementVector = new Jello.Vector2(-0.1, 0);
			this.counter = 300;
		},
		update: function(entity) {
			// invert movementVector after some time
			if(this.counter++ > 1000) {
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
		}
	});

	return movingGround;
});
