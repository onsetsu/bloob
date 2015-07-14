define(['./../lib/num/vectortools'], function(VectorTools) {

	describe('VectorTool Test Test', function() {

		it('degToRad and radToDeg should inverse each other', function() {
			var num = VectorTools.degToRad(
				VectorTools.radToDeg(
					42
				)
			);
			expect(num).toBe(42);
		});

	});

});
