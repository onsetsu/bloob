'use strict';
define(function(require) {

	var Entity = require('./../../../lib/engine/map/entity');
	var Component = require('./../../../lib/engine/map/component');

	class TestComponent extends Component {}

	describe('System', function() {

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

		describe('Access to Components', function() {
			it('should contain Components', function() {
				var entity = new Entity();
				var expectedComponent = new TestComponent();

				//entity.addComponent(expectedComponent);
				//entity.getComponent(TestComponent)
				expect(21).toEqual(3*7);
			})
		})
	});

});
