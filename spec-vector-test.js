/*
describe('MetaTest', function () {


	describe('Should work', function () {

		beforeEach(function () {
			
		});

		it('42 should be 42', function () {
			expect(42).toBe(42);
		});
		
		it('sqr should abs negative values', function() {
			expect(sqr(-42)).toBe(42);
		});

	});

});
*/
console.log('spec-vector-test: before define');
define(['./lib/num/vectortools'], function(VectorTools) {
console.log('spec-vector-test: in define');

    describe('AMD Test', function() {

        it('VectorTool Test', function() {
			var num = VectorTools.degToRad(
				VectorTools.radToDeg(
					42
				)
			);
			expect(num).toBe(42);
        });

    });

});
console.log('spec-vector-test: after define');
