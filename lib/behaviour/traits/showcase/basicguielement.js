mini.Module(
	"behaviour/traits/showcase/basicguielement"
)
.requires(
	"behaviour/trait",
	"behaviour/traits/itrait"
)
.defines(function (Trait, ITrait) {
	
	var basicGUIElement = ITrait.subclass({
		update: function(entity) {
			if(entity.isClicked()) {
				entity.getBody().getPointMass(0).Position.x++;
				return;
			}
			if(entity.isHovered())
				entity.getBody().getPointMass(0).Position.x--;
		}
	});
	
	Trait.Repository.add("showcase/basicguielement", basicGUIElement);
});
