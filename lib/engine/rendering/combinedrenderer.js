/**
 * A layer-aware renderer
 * 
 * This renderer combines the capabilities to render ingame
 * graphics as well as debug facilities.
 */
mini.Module(
	"engine/rendering/combinedrenderer"
)
.requires(
	"engine/rendering/debugdraw/debugdraw"
)
.defines(function(DebugDraw) {

	var CombinedRenderer = DebugDraw.subclass({

		/*
		 * Drawing
		 */
		draw: function(objectToDraw) {
			// Call debugDraw
			DebugDraw.prototype.draw.apply(this, arguments);
			
			// regular drawing
			objectToDraw.draw(this);
		},
		
		drawImageOnWorldAABB: function(image, aabb, sourceX, sourceY, width, height) {
			this.drawCount++;
			
			var targetPosition = aabb.Min;
			var targetExtend = aabb.getSize();

			var targetX = targetPosition.x;
			var targetY = targetPosition.y;
			var targetWidth = targetExtend.x;
			var targetHeight = targetExtend.y;

			// need to rescale in order to flip the image
			this.context.save();
			// translate the origin to the middle point of the aabb
			this.context.translate(
				targetX + targetWidth / 2,
				targetY + targetHeight / 2
			);
			// flip over x-axis
			this.context.scale(1, -1);
			// translate to top-left point of the aabb
			this.context.translate(
				-targetWidth / 2,
				-targetHeight / 2
			);
			
			this.context.drawImage(
				image,
				sourceX, sourceY,
				width, height,
				0, 0,
				targetWidth, targetHeight
			);
			this.context.restore();
		},
		
		drawImageTriangleOnWorldTriangle: function(body, image, textureMapping) {
			this.drawCount++;
			
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
			var context = this.context;
			var image = image.data;
			
			// get source triangle (in image coordinates)
			var srcA = textureMapping.coordinates[0];
			var srcB = textureMapping.coordinates[1];
			var srcC = textureMapping.coordinates[2];
			var srcAminusC = srcA.sub(srcC);
			var srcBminusC = srcB.sub(srcC);
			
			// get destination triangle (in world coordinates)
			var dstA = body.getPointMass(textureMapping.indices[0]).Position;
			var dstB = body.getPointMass(textureMapping.indices[1]).Position;
			var dstC = body.getPointMass(textureMapping.indices[2]).Position;
			var dstAminusC = dstA.sub(dstC);
			var dstBminusC = dstB.sub(dstC);
			
			// save current context for later restoration
			context.save();
			
			// apply transformation
			// idea:
			// transform the source triangle to the destination triangle using matrices
			// also use a reference triangle ((0,0), (1,0), (0,1)) as an intermediate stage
			
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
			
			this.context.drawImage(
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
	
	return CombinedRenderer;
});
