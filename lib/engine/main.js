mini.Module(
	"engine/main"
)
.requires(
	"engine/game",
	"engine/domready",
	"engine/config"
)
.defines(function(Game, domReady, Config) {
	var main = function(game, config) {
		domReady(function() {
			new game(config);
		});
	};
	
	return main;
});
