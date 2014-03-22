define([
	"behaviour/trait",
	"behaviour/traits/itrait",
	"physics/jello"
], function (Trait, ITrait, Jello) {
	
	var blowUp = ITrait.subclass({
		update: function(entity) {
			var body = entity.getBody();
			if(body) {
				// Pump the body up
				body.mGasAmount++;
				// Drag to lower left corner
				body.addGlobalForce(
					body.getDerivedPosition(),
					new Jello.Vector2(10, 2)
				);
			}
		}
	});

	return blowUp;
});
