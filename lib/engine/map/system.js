'use strict';
define(function(require) { 'use strict';
	/* jshint esnext: true */

	class System {
		constructor() {}
		addedToLayer(layer) {
			this.layer = layer;
		}
		getEntitiesMatching(...componentTypes) {
			return this.layer.getEntities().filter(entity =>
				componentTypes.every(componentType =>
					entity.hasComponent(componentType)
				)
			);
		}

		update() {}
	}

	return System;
});
