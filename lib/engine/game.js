mini.Module(
	"engine/game"
)
.requires(
	"engine/loop"
)
.defines(function(Loop) {
	var Game = mini.Class.subclass({
		initialize: function() {
			console.log("NEW GAME");
			env.game = this;
			
			// prepare datGui
			this.datGui = new dat.GUI();
			
			// prepare stats
			this.stats = new Stats();
			var stats = this.stats;
			$(this.stats.domElement)
				.css("position", "absolute")
				.css("top", $(window).scrollTop() + "px")
				.prependTo($("body"));
			$(window).scroll(function() {
			    $(stats.domElement).css('top', $(this).scrollTop() + "px");
			});
			env.loop.add(this.stats, this.stats.update);
		}
	});
	
	return Game;
});
