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
			/*
			 *  Draw a triangle segment of an image to an arbitrary other triangle
			 *  
			 *  algorithm resources (affinity transformation):
			 *  	http://www.math.ucla.edu/~baker/149.1.02w/handouts/i_affine_II.pdf
			 *  	http://people.sc.fsu.edu/~jburkardt/presentations/cg_lab_mapping_triangles.pdf
			 *  html canvas 2d transform description:
			 *  	http://www.w3.org/TR/2dcontext/#dom-context-2d-transform
			 *  original idea (but far too slow at runtime):
			 *  	http://codeslashslashcomment.com/2012/12/12/dynamic-image-distortion-html5-canvas/
			 */
			
			// create shortcuts
			var context = env.renderer.context;
			var image = image.data;
			
			// get source triangle (in image coordinates)
			var srcA = this.coordinates[0];
			var srcB = this.coordinates[1];
			var srcC = this.coordinates[2];
			var srcAminusC = srcA.sub(srcC);
			var srcBminusC = srcB.sub(srcC);
			
			// get destination triangle (in world coordinates)
			var worldDstA = body.getPointMass(this.indices[0]).Position;
			var worldDstB = body.getPointMass(this.indices[1]).Position;
			var worldDstC = body.getPointMass(this.indices[2]).Position;
			
			// get destination triangle (in screen coordinates)
			var dstA = env.camera.worldToScreenCoordinates(worldDstA);
			var dstB = env.camera.worldToScreenCoordinates(worldDstB);
			var dstC = env.camera.worldToScreenCoordinates(worldDstC);
			var dstAminusC = dstA.sub(dstC);
			var dstBminusC = dstB.sub(dstC);
			
			// save current context for later restoration
			context.save();
			
			// apply transformation
			// idea:
			// transform the source triangle to the destination triangle using matrices
			// also use a reference triangle ((0,0), (1,0), (0,1)) an an intermediate stage
			
			// transformations (note inverted order):
			
			// translate from origin
			context.translate(dstC.x, dstC.y);
			
			// affine transformation from reference triangle to destination triangle
			context.transform(dstAminusC.x, dstAminusC.y, dstBminusC.x, dstBminusC.y, 0, 0);
			
			// intermediate
			// set clipping to a triangular viewport
			// that way, only the given triangle will be drawn
			// use reference triangle to clip
			context.beginPath();
			context.moveTo(0, 0);
			context.lineTo(1, 0);
			context.lineTo(0, 1);
			context.lineTo(0, 0);
			context.clip();
			
			// affine transformation from source triangle to reference triangle
			context.transform(srcBminusC.y, -(srcAminusC.y), -(srcBminusC.x), srcAminusC.x, 0, 0);
			var determinant = ((srcAminusC.x)*(srcBminusC.y)) - ((srcAminusC.y)*(srcBminusC.x));
			context.scale(1/determinant, 1/determinant);
			
			// translate source triangle to origin
			context.translate(-(srcC.x), -(srcC.y));

			// draw test image(texture)
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
			
			// restore saved context state to revert all done changes
			context.restore();
			
		}
	});
	
	return TextureMapping;
});
