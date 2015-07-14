define(['./../lib/num/vector2'], function(Vector2) {

	describe('Vector2 Test', function() {

		it('Vector2.One should be a 1,1 Vector2', function() {
			var v = Vector2.One;
			expect(v.x).toBe(1);
			expect(v.y).toBe(1);
		});

	});

});
