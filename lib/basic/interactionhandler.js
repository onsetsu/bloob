mini.Module(
	"basic/interactionhandler"
)
.requires(

)
.defines(function() {
	var InteractionHandler = mini.Class.subclass({
		initialize: function(callback) {
			this.callback = callback || function() {};
			this.store = {};
			this.store.context = {};
			this.store.onPressed = function() {};
			this.store.onState = function() {};
			this.store.onReleased = function() {};
			this.store.name = "DEFAULT";
		},
	
		// Configuration
		name: function(name) {
			this.store.name = name;
			return this;
		},
	
		context: function(context) {
			this.store.context = context;
			return this;
		},
	
		onPressed: function(callback) {
			this.store.onPressed = callback;
			return this;
		},
	
		onState: function(callback) {
			this.store.onState = callback;
			return this;
		},
	
		onReleased: function(callback) {
			this.store.onReleased = callback;
			return this;
		},
	
		//  Use specified callback inside the updating routine.
		fireCallback: function(timePassed, button) {
			this.callback.call(timePassed, button);
			if(env.input.pressed(button))
				this.store.onPressed.call(this.store.context, timePassed);
			if(env.input.state(button))
				this.store.onState.call(this.store.context, timePassed);
			if(env.input.released(button))
				this.store.onReleased.call(this.store.context, timePassed);
		}
	});

	return InteractionHandler;
});
