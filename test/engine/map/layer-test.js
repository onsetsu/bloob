'use strict';
define(function(require) {

	var Layer = require('./../../../lib/engine/map/layer');
	var Entity = require('./../../../lib/engine/map/entity');
	var System = require('./../../../lib/engine/map/system');
	var Component = require('./../../../lib/engine/map/component');

	class TestComponent extends Component {
		constructor(value) {
			super();
			this.value = value;
		}
	}

	class TestSystem extends System {
		update() {

		}
	}

	describe('Layer', function() {

		describe('Manage Entities', function() {

			it('should allow to query for entities with components', function () {
				var layer = new Layer(),
					entity = new Entity(),
					entity2 = new Entity(),
					component = new TestComponent('foo');

				entity.addComponent(component);
				layer.addEntity(entity);
				layer.addEntity(entity2);
				expect(layer.getEntityWithComponent(TestComponent)).toBe(entity);

				entity.removeComponent(component);
				expect(layer.getEntityWithComponent(TestComponent)).toBeUndefined();
			});
		});

		describe('Manage Systems', function() {

			it('should add and remove systems', function () {
				var layer = new Layer(),
					entity = new Entity(),
					entity2 = new Entity(),
					component = new TestComponent('foo'),
					system = new TestSystem();

				entity.addComponent(component);
				layer.addEntity(entity);
				layer.addEntity(entity2);
				layer.addSystem(system);
				expect(layer.getSystems()).toContain(system);

				// TODO: check behavior with layer.updateSystems()
				// expect smtg
				entity.removeComponent(component);
				expect(layer.getEntityWithComponent(TestComponent)).not.toBeDefined();

				layer.removeSystem(system);
				expect(layer.getSystems()).not.toContain(system);
			});
		});
	});

});
