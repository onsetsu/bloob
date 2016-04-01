define(function (require) {
	var ITrait = require('./../itrait'),
		Vector2 = require('./../../../num/num').Vector2;

	var blowUp = ITrait.subclass({
		update: function(entity) {
			var body = entity.getBody();
			if(body) {
				
				// Drag to lower left corner
				body.addGlobalForce(
					body.getDerivedPosition(),
					new Vector2(10, 2)
				);
				
				if(body.isPressureBody()) {
					// Pump the body up
					var pressurePhysics = body.getPressurePhysics();
					pressurePhysics.setGasPressure(
						pressurePhysics.getGasPressure() + 1
					);
				}
			}
		}
	});

	return blowUp;
});
