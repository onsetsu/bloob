'use strict';
define(function(require) { 'use strict';
	/* jshint esnext: true */

	class System {
		_addedToLayer(layer) {
			this.layer = layer;
		}

		getEntitiesMatching(...componentTypes) {
			return this.layer.getEntities().filter(entity =>
				componentTypes.every(componentType =>
					entity.hasComponent(componentType)
				)
			);
		}
	}

	return System;
});
