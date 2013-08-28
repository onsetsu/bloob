Bloob.BodyFactory = function() {};

Bloob.BodyFactory.createBluePrint = function(targetClass) {
	return new Bloob.BodyBluePrint(targetClass);
};
