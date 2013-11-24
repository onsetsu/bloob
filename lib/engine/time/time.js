mini.Module(
	"engine/time/time"
)
.requires(

)
.defines(function() {
	var Time = mini.Class.subclass({
		initialize: function() {
			this.timePassed = 0;
		},
		update: function(timePassed) {
			this.timePassed = timePassed;
		}
	});
	
	return Time;
});
