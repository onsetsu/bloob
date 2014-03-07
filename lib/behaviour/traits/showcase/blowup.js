mini.Module(
	"behaviour/traits/showcase/blowup"
)
.requires(
	"behaviour/trait",
	"behaviour/traits/itrait"
)
.defines(function (Trait, ITrait) {
	
	var blowUp = ITrait.subclass({
		update: function(entity) {
			var body = entity.getBody();
			if(body) {
				// Pump the body up
				body.mGasAmount++;
				// Drag to lower left corner
				body.addGlobalForce(
					body.getDerivedPosition(),
					new Vector2(10, 2)
				);
			}
		}
	});

	Trait.Repository.add("showcase/blowup", blowUp);
});
