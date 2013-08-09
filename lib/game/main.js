$("body").ready(function() {
	window.gui = new dat.GUI();
	new Bloob.Game(new Bloob.Config()
		.setStartLevel("SecondMap")
	);
});
