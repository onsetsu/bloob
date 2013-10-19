var BodyFactory = function() {};

BodyFactory.createBluePrint = function(targetClass) {
	return new BodyBluePrint(targetClass);
};
