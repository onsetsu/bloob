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
console.log('spec-metatest: before define');
define(['./sqr'], function(sqr) {
console.log('spec-metatest: in define');

    describe('AMD Test', function() {

        it('tautology: 42 should be 42', function() {
			expect(42).toBe(42);
        });

        it('sqr should abs negative values', function() {
			expect(sqr(-42)).toBe(42);
        });

    });

});
console.log('spec-metatest: after define');
