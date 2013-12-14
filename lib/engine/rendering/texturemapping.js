mini.Module(
	"engine/rendering/texturemapping"
)
.requires(
	"engine/rendering/image"
)
.defines(function(Image) {
	var TextureMapping = mini.Class.subclass({
		initialize: function(image) {
			this.image = image;
		},
		
		from: function(coordinates) {
			// TODO: calc image part
			this.coordinates = coordinates;

			return this;
		},
		
		to: function(indices) {
			this.indices = indices;
			
			return this;
		},
		
		drawOn: function(body, image) {
			var context = env.renderer.context;
			var image = image.data;
			
			var srcA = this.coordinates[0];
			var srcB = this.coordinates[1];
			var srcC = this.coordinates[2];
			var srcAminusC = srcA.sub(srcC);
			var srcBminusC = srcB.sub(srcC);
			
			var worldDstA = body.getPointMass(this.indices[0]).Position;
			var worldDstB = body.getPointMass(this.indices[1]).Position;
			var worldDstC = body.getPointMass(this.indices[2]).Position;
			var dstA = env.camera.worldToScreenCoordinates(worldDstA);
			var dstB = env.camera.worldToScreenCoordinates(worldDstB);
			var dstC = env.camera.worldToScreenCoordinates(worldDstC);
			var dstAminusC = dstA.sub(dstC);
			var dstBminusC = dstB.sub(dstC);
			
			// save current context for later restoration
			context.save();
			
			// apply transformation (note inversed order)
			
			// translate from origin
			context.translate(dstC.x, dstC.y);
			// affine from refT
			context.transform(dstAminusC.x, dstAminusC.y, dstBminusC.x, dstBminusC.y, 0, 0);
			// clip triangular viewport (use reference triangle to clip)
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
	
	return TextureMapping;
});
