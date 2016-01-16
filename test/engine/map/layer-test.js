'use strict';
define(function(require) {

	var Layer = require('./../../../lib/engine/map/layer');
	var Entity = require('./../../../lib/engine/map/entity');
	var Component = require('./../../../lib/engine/map/component');

	class TestComponent extends Component {
		constructor(value) {
			super();
			this.value = value;
		}
	}

	describe('Layer', function() {

		describe('Access to Components', function() {

			it('should allow to query for entities with components', function () {
				var layer = new Layer(),
					entity = new Entity(),
					entity2 = new Entity(),
					component = new TestComponent('foo');

				entity.addComponent(component);
				layer.addEntity(entity);
				layer.addEntity(entity2);

				expect(layer.getEntityWithComponent(TestComponent)).toBe(entity);
				expect(layer.getEntityWithComponent(TestComponent)).not.toBe(entity2);
			});
		});
	});

});
