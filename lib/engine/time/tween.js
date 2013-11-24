mini.Module(
	"engine/time/tween"
)
.requires(
	"engine/time/ease",
	"engine/time/timer",
	"engine/time/scale"
)
.defines(function(Ease, Timer, Scale) {
	var TweenItem = mini.Class.subclass({
		initialize: function(properties, duration, ease) {
			this.endValues = properties || {};
			this.duration = duration || 0;
			this.ease = ease || Ease.linear();
			this.ease.domain([0, duration]).range([0, 1]);
			
			this.startValues = {};
			this.alreadyElapsed = 0;
		},
		attach: function(nextTween) {
			if(typeof this.next === "undefined")
				this.next = nextTween;
			else
				this.next.attach(nextTween);
		},
		update: function(timePassed, target) {
			// Already processed this TweenItem. Process next item if available.
			if(this.alreadyElapsed > this.duration) {
				if(typeof this.next !== "undefined")
					return this.next.update(timePassed, target);
				return false;
			}

			// Get done with this TweenItem in this iteration.
			if(this.alreadyElapsed <= this.duration && this.alreadyElapsed + timePassed > this.duration) {
				this.alreadyElapsed += timePassed;
				
				for(var property in this.endValues) {
					var startValue = this.startValues[property] || 0;
					var endValue = this.endValues[property];
					var newValue = (Scale.linear().domain([0, 1]).range([startValue, endValue]))(1);
					target[property] = newValue;
				}

				// Return true, if total duration is exceeded.
				if(typeof this.next !== "undefined")
					return this.next.setStartValues(target).update(this.alreadyElapsed - this.duration, target);
				return true;
			}

			// Normal iteration.
			if(this.alreadyElapsed + timePassed <= this.duration) {
				this.alreadyElapsed += timePassed;
				var interpolation = this.ease(this.alreadyElapsed);

				for(var property in this.endValues) {
					var startValue = this.startValues[property] || 0;
					var endValue = this.endValues[property];
					var newValue = (Scale.linear().domain([0, 1]).range([startValue, endValue]))(interpolation);
					target[property] = newValue;
				}
				
				return false;
			};
		},
		setStartValues: function(target) {
			for(var property in this.endValues) {
				this.startValues[property] = target[property] || 0;
			}
			
			return this;
		}
	});
	
	var Tween = mini.Class.subclass({
		initialize: function(target) {
			this.target = target;
			
			this.updateCallbacks = [];
			this.finishCallbacks = [];
			this.item = new TweenItem({}, 0);
		},
		wait: function(duration) {
			this.item.attach(new TweenItem({}, duration));
			
			return this;
		},
		to: function(properties, duration, ease) {
			this.item.attach(new TweenItem(properties, duration, ease));
			
			return this;
		},
		update: function() {
			if(this.item.update(env.time.timePassed, this.target)) {
				this.finished();
				this.stop();
			};

			for(var callbackIndex in this.updateCallbacks) {
				this.updateCallbacks[callbackIndex](this);
			};
		},
		
		// Callback handling.
		onUpdate: function(callback) {
			this.updateCallbacks.push(callback);
			
			return this;
		},
		onFinished: function(callback) {
			this.finishCallbacks.push(callback);
			
			return this;
		},
		finished: function() {
			for(var callbackIndex in this.finishCallbacks) {
				this.finishCallbacks[callbackIndex](this);
			};
		},
		
		// Integrate into game loop.
		start: function() {
			env.loop.add(this, this.update, "this is a tween");
			
			return this;
		},
		stop: function() {
			env.loop.remove("this is a tween");
			
			return this;
		}
	});
	
	Tween.Ease = Ease;
	
	return Tween;
});
