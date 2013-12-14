mini.Module(
	"engine/rendering/texture"
)
.requires(
	"engine/rendering/texturemapping",
	"engine/rendering/image"
)
.defines(function(TextureMapping, Image) {

	var Texture = mini.Class.subclass({
		image: Image.get("sample.png"),
		initialize: function(/*image*/) {
			//this.image = image;
			this.mappings = [];
		},

		from: function(coordinates) {
			this.currentMapping = new TextureMapping(this.image).from(coordinates);
			
			return this;
		},

		to: function(indices) {
			this.currentMapping.to(indices);
			this.mappings.push(this.currentMapping);
			
			return this;
		},

		drawOn: function(body) {
			var context = env.renderer.context;
			var image = this.image.data;
			
			var srcA = new Jello.Vector2(10, 10);
			var srcB = new Jello.Vector2(100, 30);
			var srcC = new Jello.Vector2(5, 50);
			var srcAminusC = srcA.sub(srcC);
			var srcBminusC = srcB.sub(srcC);
			
			var dstA = new Jello.Vector2(10, 60);
			var dstB = new Jello.Vector2(50, 20);
			var dstC = new Jello.Vector2(40, 80);
			var dstAminusC = dstA.sub(dstC);
			var dstBminusC = dstB.sub(dstC);
			
			// save current context for later restoration
			context.save();
			
			// apply transformation
			
			// translate from origin
			context.translate(dstC.x, dstC.y);
			// affine from refT
			context.transform(dstAminusC.x, dstAminusC.y, dstBminusC.x, dstBminusC.y, 0, 0);
			// clip triangular viewport
			context.beginPath();
			context.moveTo(0, 0);
			context.lineTo(1, 0);
			context.lineTo(0, 1);
			context.lineTo(0, 0);
			context.clip();
			// affine to refT
			context.transform(srcBminusC.y, -(srcAminusC.y), -(srcBminusC.x), srcAminusC.x, 0, 0);
			var determinant = ((srcAminusC.x)*(srcBminusC.y)) - ((srcAminusC.y)*(srcBminusC.x));
			context.scale(1/determinant, 1/determinant);
			// translate to origin
			context.translate(-(srcC.x), -(srcC.y));

			// test image(texture)
			var sourceX = 0;
			var sourceY = 0;
			var width = image.width;
			var height = image.height;
			var targetX = 0;
			var targetY = 0;
			var targetWidth = image.width;
			var targetHeight = image.height;
			
			env.renderer.context.drawImage(
				image,
				sourceX, sourceY,
				width, height,
				targetX, targetY,
				targetWidth, targetHeight
			);
			
			// restore saved context state
			context.restore();
		}
	});
	
	return Texture;
});
