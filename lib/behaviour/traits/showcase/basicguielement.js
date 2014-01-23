mini.Module(
	"behaviour/traits/showcase/basicguielement"
)
.requires(
	"behaviour/trait"
)
.defines(function (Trait) {
	Trait.Repository.add("showcase/basicguielement", function(entity) {
		if(entity.isClicked()) {
			entity.getBody().getPointMass(0).Position.x++;
			return;
		}
		if(entity.isHovered())
			entity.getBody().getPointMass(0).Position.x--;
	});
});
