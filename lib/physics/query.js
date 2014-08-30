define(["physics/circlecast"], function(CircleCast) {

	return {
	    CircleCast: CircleCast,
	    Circle: function(origin, radius) {
            this.origin = origin;
            this.radius = radius;
	    },
	    Ray: function(origin, direction) {
            this.origin = origin;
            this.direction = direction;
        }
	};
});
