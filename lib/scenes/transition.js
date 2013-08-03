Bloob.Transition = function() {
	this.store = {};
};

Bloob.Transition.prototype.from = function(fromScene) {
	this.store.fromScene = fromScene;
	return this;
};


Bloob.Transition.prototype.to = function(toScene) {
	this.store.toScene = toScene;
	return this;
};

