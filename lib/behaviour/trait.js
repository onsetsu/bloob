mini.Module(
	"behaviour/trait"
)
.requires(
	"assets/resource"
)
.defines(function() {
	var Trait = mini.Class.subclass({
		initialize: function() {
		},
		update: function(timePassed, entity) {
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
	
	return Trait;
});
