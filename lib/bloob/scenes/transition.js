mini.Module(
	"bloob/scenes/transition"
)
.requires(

)
.defines(function() {
	var Transition = function() {
		this.store = {};
	};

	Transition.prototype.from = function(fromScene) {
		this.store.fromScene = fromScene;
		return this;
	};


	Transition.prototype.to = function(toScene) {
		this.store.toScene = toScene;
		return this;
	};

	Bloob.Transition = Transition;
	
	return Transition;
});
