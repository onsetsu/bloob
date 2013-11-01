mini.Module(
	"engine/rendering/animation"
)
.requires(
	"engine/rendering/animationsheet"
)
.defines(function(AnimationSheet) {
	var Animation = mini.Class.subclass({
		initialize: function(sheet, frameTime, order) {
			this.sheet = sheet;
			this.frameTime = frameTime;
			this.currentTime = 0;

			this.order = order;
			this.orderIndex = 0;
			this.tileNumber = this.order[this.orderIndex];
		},
		
		update: function(timePassed) {
			this.currentTime += timePassed;
			
			while(this.currentTime >= this.frameTime) {
				this.currentTime -= this.frameTime;
				this.orderIndex = (this.orderIndex + 1) % this.order.length;
				this.tileNumber = this.order[this.orderIndex];
			};
		},
		
		draw: function(targetAABB) {
			this.sheet.draw(targetAABB, this.tileNumber);
		}
	});
	
	return Animation;
});