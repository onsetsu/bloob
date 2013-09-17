mini.Module(
		"basic/interactionhandler"
)
.requires(
		"basic/camera"
)
.defines(function() {
	var InteractionHandler = function(callback) {
		this.callback = callback || function() {};
		this.store = {};
		this.store.context = {};
		this.store.onPressed = function() {};
		this.store.onState = function() {};
		this.store.onReleased = function() {};
		this.store.name = "DEFAULT";
	};

	// Configuration
	InteractionHandler.prototype.name = function(name) {
		this.store.name = name;
		return this;
	};

	InteractionHandler.prototype.context = function(context) {
		this.store.context = context;
		return this;
	};

	InteractionHandler.prototype.onPressed = function(callback) {
		this.store.onPressed = callback;
		return this;
	};

	InteractionHandler.prototype.onState = function(callback) {
		this.store.onState = callback;
		return this;
	};

	InteractionHandler.prototype.onReleased = function(callback) {
		this.store.onReleased = callback;
		return this;
	};

	//  Use specified callback inside the updating routine.
	InteractionHandler.prototype.fireCallback = function(context$Listener$mouse, timePassed, button) {
		this.callback.call(context$Listener$mouse, timePassed, button);
		if(context$Listener$mouse.input.pressed(button))
			this.store.onPressed.call(this.store.context, timePassed, context$Listener$mouse);
		if(context$Listener$mouse.input.state(button))
			this.store.onState.call(this.store.context, timePassed, context$Listener$mouse);
		if(context$Listener$mouse.input.released(button))
			this.store.onReleased.call(this.store.context, timePassed, context$Listener$mouse);
	};
	
	Bloob.InteractionHandler = InteractionHandler;
	
	return InteractionHandler;
});
