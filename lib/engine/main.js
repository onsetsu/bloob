mini.Module(
	"engine/main"
)
.requires(
	"game/game",
	"engine/domready",
	"game/config"
)
.defines(function(Game, domReady, Config) {
	domReady(function() {
		new Game(new Config()
			.setStartLevel("SecondMap")
		);
		new Game(new Config()
			.setStartLevel("SecondMap")
		);
		new Game();
	});
	var main = function() {};
	
	return main;
});
