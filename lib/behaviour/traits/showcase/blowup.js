mini.Module(
	"behaviour/traits/showcase/blowup"
)
.requires(
	"behaviour/trait"
)
.defines(function (Trait) {
	Trait.Repository.add("showcase/blowup", function(entity) {
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
	});
});
