mini.Module(
	"engine/rendering/image"
)
.requires(
	"assets/resource"
)
.defines(function(Resource) {
	var Image = Resource.subclass({
		initialize: function(path) {
			Resource.prototype.initialize.apply(this, arguments);

			this.path = path;
		},
		
		load: function(callback) {
			this.data = new window.Image();
			this.data.onload = callback;
			this.data.onerror = callback;
			this.data.src = "data/graphics/" + this.path;
		},
		
		draw: function(aabb, sourceX, sourceY, width, height) {
			var targetPosition = env.camera.worldToScreenCoordinates(
				new Jello.Vector2(aabb.Min.x, aabb.Max.y)
			);
			var targetExtend = env.camera.worldToScreenCoordinates(
				new Jello.Vector2(aabb.Max.x, aabb.Min.y)
			).sub(
				env.camera.worldToScreenCoordinates(
					new Jello.Vector2(aabb.Min.x, aabb.Max.y)
				)
			);

			var image = this.data;
			var targetX = targetPosition.x;
			var targetY = targetPosition.y;
			var targetWidth = targetExtend.x;
			var targetHeight = targetExtend.y;
			
			env.renderer.context.drawImage(
				image,
				sourceX, sourceY,
				width, height,
				targetX, targetY,
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
