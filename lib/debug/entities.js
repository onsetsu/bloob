mini.Module(
	'debug/entities'
)
.requires(
	'engine/domready',
	'debug/menu',
	'debug/panel',
	'engine/firefly'
)
.defines(function(domReady, Menu, DebugPanel, ff){ "use strict";

/**
 *  ---------------------------- ENTITIES PANEL ----------------------------
 */
var bodyDebugDrawAABB = Jello.Body.prototype.debugDrawAABB;
Jello.Body.prototype.debugDrawAABB = function(debugDraw) {
	if(Jello.Body.shouldDebugDrawAABB)
		bodyDebugDrawAABB.apply(this, arguments);
};
Jello.Body.shouldDebugDrawAABB = true;

var debugDrawGlobalShape = Jello.Body.prototype.debugDrawGlobalShape;
Jello.Body.prototype.debugDrawGlobalShape = function(debugDraw) {
	if(Jello.Body.shouldDebugDrawGlobalShape)
		debugDrawGlobalShape.apply(this, arguments);
};
Jello.Body.shouldDebugDrawGlobalShape = true;

var debugDrawPolygon = Jello.Body.prototype.debugDrawPolygon;
Jello.Body.prototype.debugDrawPolygon = function(debugDraw) {
	if(Jello.Body.shouldDebugDrawPolygon)
		debugDrawPolygon.apply(this, arguments);
};
Jello.Body.shouldDebugDrawPolygon = true;

var debugDrawPointMasses = Jello.Body.prototype.debugDrawPointMasses;
Jello.Body.prototype.debugDrawPointMasses = function(debugDraw) {
	if(Jello.Body.shouldDebugDrawPointMasses)
		debugDrawPointMasses.apply(this, arguments);
};
Jello.Body.shouldDebugDrawPointMasses = true;

var debugDrawMiddlePoint = Jello.Body.prototype.debugDrawMiddlePoint;
Jello.Body.prototype.debugDrawMiddlePoint = function(debugDraw) {
	if(Jello.Body.shouldDebugDrawMiddlePoint)
		debugDrawMiddlePoint.apply(this, arguments);
};
Jello.Body.shouldDebugDrawMiddlePoint = false;

domReady(function() {
	
	ff.debug.addPanel({
		type: DebugPanel,
		name: 'entities',
		label: 'Entities',
		options: [
				{
					name: 'AABB',
					object: Jello.Body,
					property: 'shouldDebugDrawAABB'
				},
				{
					name: 'GlobalShape',
					object: Jello.Body,
					property: 'shouldDebugDrawGlobalShape'
				},
				{
					name: 'Polygon',
					object: Jello.Body,
					property: 'shouldDebugDrawPolygon'
				},
				{
					name: 'PointMasses',
					object: Jello.Body,
					property: 'shouldDebugDrawPointMasses'
				},
				{
					name: 'MiddlePoint',
					object: Jello.Body,
					property: 'shouldDebugDrawMiddlePoint'
				}
		]
	});
	ff.debug.addPanel({
		type: DebugPanel,
		name: 'entities2',
		label: 'Entities2',
		options: [
			{
				name: 'JustForTesting',
				object: Jello.Body,
				property: 'shouldDebugDrawAABB'
			}
		]
	});

});

});