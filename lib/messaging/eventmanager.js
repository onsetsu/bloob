define([], function() {
	
	var Signal = mini.Class.subclass({
		initialize: function(eventManager, messageTag) {
			this._eventManager = eventManager;
			this._messageTag = messageTag;
		},
		emit: function(/* arguments */) {
			this._eventManager.send(this._messageTag, arguments);
		}
	});
	
	var Slot = mini.Class.subclass({
		initialize: function(callback, filter, map) {
			
		},
		attach: function(callback) {
			
		}
	});
	
	var EventManager = mini.Class.subclass({
		initialize: function() {
			this.clear();
		},
		signal: function(messageTag) {
			this._signals[messageTag] = this._signals[messageTag] || new Signal(this, messageTag);
			
			return this._signals[messageTag];
		},
		slot: function(messageTag) {
			
		},
		clear: function() {
			this._signals = {};
			this._slots = {};
		},
		send: function(messageTag, args) {
			Bloob.log("sended " + messageTag + " with ", args);
		}
	});
	
	return EventManager;
});
