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
				body.mGasAmount++;
			}
			if(body) {
				body.addGlobalForce(
					body.getDerivedPosition(),
					new Vector2(10, 2)
				);
			}
		}
	});

	Trait.Repository.add("showcase/blowup", blowUp);
});
