mini.Module(
	"engine/game"
)
.requires(
	"engine/loop"
)
.defines(function(Loop) {
	var Game = mini.Class.subclass({
		initialize: function() {
			Bloob.log("NEW GAME");
			env.game = this;
			
			// prepare datGui
			this.datGui = new dat.GUI();
			
			// prepare stats
			var stats = new Stats();
			$(stats.domElement)
				.css("position", "absolute")
				.css("top", $(window).scrollTop() + "px")
				.prependTo($("body"));
			$(window).scroll(function() {
			    $(stats.domElement).css('top', $(this).scrollTop() + "px");
			});
			env.loop.add(stats, stats.update);
		}
	});
	
	return Game;
});
