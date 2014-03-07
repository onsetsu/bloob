mini.Module(
	"behaviour/traits/showcase/firefly"
)
.requires(
	"behaviour/trait",
	"behaviour/traits/itrait"
)
.defines(function (Trait, ITrait) {
	
	var firefly = ITrait.subclass({
		initialize: function(entity) {
			var body = entity.getBody();

			// make fireflies fly
			body.clearExternalForces();
			
			this.center = body.getDerivedPosition().add(
				// add some noise
				new Jello.Vector2(Math.random(), Math.random())
			);
		},
		update: function(entity) {
			var body = entity.getBody();
	
			var toCenter = this.center.sub(body.getDerivedPosition());
			var direction = toCenter.getPerpendicular();
			// add force to center
			body.addGlobalForce(body.getDerivedPosition(), toCenter.mulFloat(1.5));
			// add force perpendicular to center
			body.addGlobalForce(body.getDerivedPosition(), direction.normalizedCopy().mulFloat(0.9));
		}
	});

	Trait.Repository.add("showcase/firefly", firefly);
});

