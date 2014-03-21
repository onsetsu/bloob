mini.Module(
	"physics/bodyfactory"
)
.requires(
	"physics/bodyblueprint"
)
.defines(function(
	BodyBlueprint
) {
	BodyFactory = function() {};

	BodyFactory.createBluePrint = function(targetClass) {
		return new BodyBlueprint(targetClass);
	};
	
	return BodyFactory;
});
