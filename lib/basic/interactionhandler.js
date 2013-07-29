Bloob.InteractionHandler = function(callback) {
	this.callback = callback;
};

Bloob.InteractionHandler.prototype.fireCallback = function(context$Listener$mouse, timePassed, button) {
	this.callback.call(context$Listener$mouse, timePassed, button);
};

