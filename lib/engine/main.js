mini.Module(
	"engine/main"
)
.requires(
	"engine/game",
	"engine/domready"
)
.defines(function(Game, domReady) {
	var main = function(game) {
		domReady(function() {
			new game();
		});
	};
	
	return main;
});
