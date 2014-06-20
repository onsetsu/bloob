define([], function(UniqueIdGenerator) {
	
	var SceneStack = mini.Class.subclass({
		initialize: function() {
			this._stack = [];
		},
		run: function(scene) {
		},
		push: function(scene) {
		},
		pop: function() {
		},
		top: function() {
		},
		inBetween: function(scene) {
			// TODO: define semantics
		},
		pause: function() {
		},
		resume: function() {
		}
	});

	return SceneStack;
	
});
