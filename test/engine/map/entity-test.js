define(['./../../../lib/engine/map/entity'], function(Entity) {

	describe('Entity', function() {

		it('should carry attached tags', function() {
			var blockEntity = new Entity('testBlock');

			blockEntity.addTag('moving');
			blockEntity.addTag('entity');

			expect(blockEntity.hasTag('moving')).toBe(true);
			expect(blockEntity.hasTag('entity')).toBe(true);

			blockEntity.removeTag('moving');

			expect(blockEntity.hasTag('moving')).toBe(false);
			expect(blockEntity.hasTag('entity')).toBe(true);
		});

	});

});
