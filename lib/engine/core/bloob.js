mini.Module(
	"engine/core/bloob"
)
.requires(

)
.defines(function() {
	window.Bloob = {
		log: function() {},
		mark: function() {},
		show: function() {},
		assert: function() {}
	};
	
	var Bloob = window.Bloob;
	
	return Bloob;
});
