define(["physics/bodyblueprint"], function(BodyBlueprint) {
	var BodyFactory = function() {};

	BodyFactory.createBluePrint = function(targetClass) {
		return new BodyBlueprint(targetClass);
	};
	
	return BodyFactory;
});
