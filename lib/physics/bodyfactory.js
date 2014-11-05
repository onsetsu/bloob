define(function(require) {
    var BodyBlueprint = require('./bodyblueprint');

	var BodyFactory = {
        createBluePrint: function() {
            return new BodyBlueprint();
        }
	};

	return BodyFactory;
});
