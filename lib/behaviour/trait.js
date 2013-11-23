mini.Module(
	"behaviour/trait"
)
.requires(
	"assets/resource"
)
.defines(function() {
	var Trait = mini.Class.subclass({
		initialize: function() {
		},
		update: function(timePassed) {
			console.log(timePassed);
		}
	});
	
	return Trait;
});
