mini.Module(
	"engine/time/ease"
)
.requires(
	"engine/time/scale"
)
.defines(function(Scale) {
	var Ease = mini.Class.subclass({
		initialize: function() {
			
		}
	});
	
	Ease.linear = function() {};
	
	return Scale;
});
