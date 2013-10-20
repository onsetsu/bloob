mini.Module(
	"engine/main"
)
.requires(
	"engine/game",
	"engine/core/environment",
	"engine/domready"
)
.defines(function(Game, Environment, domReady) {
	var main = function(game) {
		env = {};
		
		domReady(function() {
			new (game)();
		});
	};
	
	return main;
});
