mini.Module(
	"engine/rendering/image"
)
.requires(
	"assets/resource"
)
.defines(function(Resource) {
	var Image = Resource.subclass({
		initialize: function(path) {
			this.path = path;
			this.load(function() {
				console.log(arguments);
			});
		},
		
		load: function(callback) {
			this.data = new window.Image();
			this.data.onload = callback;
			this.data.onerror = callback;
			this.data.src = "data/graphics/" + this.path;
		},
		
		draw: function() {
			var image = this.data;
			var sourceX = 50;
			var sourceY = 50;
			var width = 100;
			var height = 80;
			var drawPosX = 20;
			var drawPosY = 30;
			var targetWidth = 40;
			var targetHeight = 50;
			env.renderer.context.drawImage(
				image,
				sourceX, sourceY,
				width, height,
				drawPosX, drawPosY,
				targetWidth, targetHeight
			);
		}
	});
	
	Image.cache = {};
	Image.get = function(path) {
		if(typeof Image.cache[path] === "undefined") {
			Image.cache[path] = new Image(path);
		};
		
		return Image.cache[path];
	};
	
	return Image;
});
