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
		fireCallback: function(context_Listener_mouse, timePassed, button) {
			this.callback.call(context_Listener_mouse, timePassed, button);
			if(context_Listener_mouse.input.pressed(button))
				this.store.onPressed.call(this.store.context, timePassed, context_Listener_mouse);
			if(context_Listener_mouse.input.state(button))
				this.store.onState.call(this.store.context, timePassed, context_Listener_mouse);
			if(context_Listener_mouse.input.released(button))
				this.store.onReleased.call(this.store.context, timePassed, context_Listener_mouse);
		}
	});

	return InteractionHandler;
});
