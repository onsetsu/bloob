'use strict';
define(function(require) {

	var Entity = require('./../../../lib/engine/map/entity');
	var Component = require('./../../../lib/engine/map/component');

	class TestComponent extends Component {
		constructor(value) {
			super();
			this.value = value;
		}
	}

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

		describe('Access to Components', function() {

			it('can contain Components', function() {
				var entity = new Entity();
				var expectedComponent = new TestComponent(1),
					expectedComponent2 = new TestComponent(2);

				expect(entity.hasComponent(TestComponent)).toBe(false);

				entity.addComponent(expectedComponent);
				expect(entity.hasComponent(TestComponent)).toBe(true);
				expect(entity.getComponent(TestComponent)).toBe(expectedComponent);

				entity.addComponent(expectedComponent2);
				expect(entity.getComponents(TestComponent)).toContain(expectedComponent);
				expect(entity.getComponents(TestComponent)).toContain(expectedComponent2);

				entity.removeComponent(expectedComponent);
				expect(entity.getComponents(TestComponent)).not.toContain(expectedComponent);
				expect(entity.getComponents(TestComponent)).toContain(expectedComponent2);

				entity.clearComponents(TestComponent);
				expect(entity.getComponents(TestComponent)).not.toContain(expectedComponent);
				expect(entity.getComponents(TestComponent)).not.toContain(expectedComponent2);
				expect(entity.hasComponent(TestComponent)).toBe(false);
			});
		})
	});

});
