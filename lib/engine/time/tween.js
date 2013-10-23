mini.Module(
	"engine/time/tween"
)
.requires(
	"engine/time/ease",
	"engine/time/timer"
)
.defines(function(Ease, Timer) {
	var TweenItem = mini.Class.subclass({
		initialize: function(properties, duration, ease) {
			this.properties = properties || {};
			this.duration = duration || 0;
			this.ease = ease || Ease.linear();
		},
		attach: function(nextTween) {
			if(typeof this.next === "undefined")
				this.next = nextTween;
			else
				this.next.attach(nextTween);
		}
	});
	
	var Tween = mini.Class.subclass({
		initialize: function(target) {
			this.target = target;
			
			this.item = new TweenItem({}, 0);
		},
		wait: function(duration) {
			this.item.attach(new Tween({}, duration));
			
			return this;
		},
		to: function(properties, duration, ease) {
			this.item.attach(new Tween(properties, duration, ease));
			
			return this;
		},
		update: function(timePassed) {
			
		},
		onUpdate: function() {
			
			
			return this;
		},
		onFinished: function() {
			
			return this;
		},
		start: function() {
			env.loop.add(this, this.update, "this is a tween");
			
			return this;
		}
	});
	
	return Tween;
});
