mini.Module(
	"behaviour/trait"
)
.requires(
	"assets/resource"
)
.defines(function() {
	var Trait = mini.Class.subclass({
		initialize: function(callback) {
			this.callback = callback;
		},
		update: function(entity) {
			this.callback.apply(this, arguments);
		}
	});
	
	return Trait;
});
