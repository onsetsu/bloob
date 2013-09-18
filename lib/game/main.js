mini.Module(
	"game/main"
)
.requires(
	"game/game",
	"engine/domready"
)
.defines(function(game, domReady) {
	domReady(function() {
		new Bloob.Game(new Bloob.Config()
			.setStartLevel("SecondMap")
		);
		new Bloob.Game(new Bloob.Config()
			.setStartLevel("SecondMap")
		);
		new Bloob.Game();
	});
	var main = function() {};
	
	return main;
});
