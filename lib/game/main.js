mini.Module(
		"game/main"
)
.requires(
		"game/game"
)
.defines(function() {
	$("body").ready(function() {
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
