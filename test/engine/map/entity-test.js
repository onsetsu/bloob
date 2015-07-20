define(['./../../../lib/engine/map/entity'], function(Entity) {

	describe('Entity', function() {

		it('should carry attached tags', function() {
			var blockEntity = new Entity('testBlock');

			blockEntity.addTag('moving');
			blockEntity.addTag('entity');

			console.log('block has tag moving', blockEntity.hasTag('moving'));
			expect(blockEntity.hasTag('moving')).toBe(true);
			console.log('block has tag entity', blockEntity.hasTag('entity'));
			expect(blockEntity.hasTag('entity')).toBe(true);

			blockEntity.removeTag('moving');

			console.log('block should not have tag moving', blockEntity.hasTag('moving'));
			expect(blockEntity.hasTag('moving')).toBe(false);
			console.log('block has tag entity', blockEntity.hasTag('entity'));
			expect(blockEntity.hasTag('entity')).toBe(true);

			console.log(blockEntity.getTags());
			expect(blockEntity.hasTag('moving')).toBe(false);
			expect(blockEntity.hasTag('entity')).toBe(false);
		});

	});

});
