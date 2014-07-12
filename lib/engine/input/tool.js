define([
    "engine/input",
    "physics/jello"
], function(Input, Jello) {

	var ToolEvent = mini.Class.subclass({
		initialize: function ToolEvent(tool, type, event) {
			this.tool = tool;
			this.type = type;
			this.event = event;
		},

		getPoint: function() {
			return this._choosePoint(this._point, this.tool._point);
		},

		setPoint: function(point) {
			this._point = point;
		},

		getLastPoint: function() {
			return this._choosePoint(this._lastPoint, this.tool._lastPoint);
		},

		setLastPoint: function(lastPoint) {
			this._lastPoint = lastPoint;
		},

		getDownPoint: function() {
			return this._choosePoint(this._downPoint, this.tool._downPoint);
		},

		setDownPoint: function(downPoint) {
			this._downPoint = downPoint;
		},

		getDelta: function() {
			return !this._delta && this.tool._lastPoint
			 		? this.tool._point.subtract(this.tool._lastPoint)
					: this._delta;
		},

		setDelta: function(delta) {
			this._delta = delta;
		},

		getCount: function() {
			return /^mouse(down|up)$/.test(this.type)
					? this.tool._downCount
					: this.tool._count;
		},

		setCount: function(count) {
			this.tool[/^mouse(down|up)$/.test(this.type) ? 'downCount' : 'count']
				= count;
		},

		getItem: function() {
			if (!this._item) {
				var result = this.tool._scope.project.hitTest(this.getPoint());
				if (result) {
					var item = result.item,
						parent = item._parent;
					while (/^(Group|CompoundPath)$/.test(parent._class)) {
						item = parent;
						parent = parent._parent;
					}
					this._item = item;
				}
			}
			return this._item;
		},
		setItem: function(item) {
			this._item = item;
		},

		toString: function() {
			return '{ type: ' + this.type
					+ ', point: ' + this.getPoint()
					+ ', count: ' + this.getCount()
					+ ', modifiers: ' + this.getModifiers()
					+ ' }';
		}
	});
	
	var Tool = mini.Class.subclass({
		_events: [ 'onActivate', 'onDeactivate',
				'onMouseDown', 'onMouseUp', 'onMouseDrag', 'onMouseMove',
				'onKeyDown', 'onKeyUp' ],

		initialize: function Tool() {
			env.input.initMouse();
			env.input.bind(Input.KEY.MOUSE1, Tool._mouseButton);
			
			this._firstMove = true;
			this._count = 0;
			this._downCount = 0;
			
			this._lastPosition = new Jello.Vector2(env.input.mouse.x, env.input.mouse.y);

			
			// callbacks
			this._activateCallback = function() {};
			this._deactivateCallback = function() {};
			this._mouseDownCallback = function() {};
			this._mouseDragCallback = function() {};
			this._mouseMoveCallback = function() {};
			this._mouseUpCallback = function() {};
			//this._KeyDownCallback = function() {};
			//this._KeyUpCallback = function() {};
		},
		
		onActivate: function(callback) { this._activateCallback = callback; },
		onDeactivate: function(callback) { this._deactivateCallback = callback; },
		onMouseDown: function(callback) { this._mouseDownCallback = callback; },
		onMouseDrag: function(callback) { this._mouseDragCallback = callback; },
		onMouseMove: function(callback) { this._mouseMoveCallback = callback; },
		onMouseUp: function(callback) { this._mouseUpCallback = callback; },
		//onKeyDown: function(callback) { this._KeyDownCallback = callback; },
		//onKeyUp: function(callback) { this._KeyUpCallback = callback; },
		
		activate: function() {
			env.input.tool.deactivate();
			env.input.tool = this;
			this._activateCallback.call(this);
		},

		deactivate: function() {
			this._deactivateCallback.call(this);
		},

		update: function() {
			var position = new Jello.Vector2(env.input.mouse.x, env.input.mouse.y);
			env.camera.screenToWorldCoordinates(env.input.mouse);

			var event = new ToolEvent();
			// down
			if(env.input.pressed(Tool._mouseButton))
				this._mouseUpCallback.call(this, event);

			// drag
			if(env.input.state(Tool._mouseButton))
				this._mouseUpCallback.call(this, event);

			// move
			if(!env.input.state(Tool._mouseButton))
				this._mouseUpCallback.call(this, event);
			
			// up
			if(env.input.released(Tool._mouseButton))
				this._mouseUpCallback.call(this, event);
			
			this._lastPosition = position.copy();
		},
		
		_updateEvent: function(type, point, minDistance, maxDistance, start,
				needsChange, matchMaxDistance) {
			if (!start) {
				if (minDistance != null || maxDistance != null) {
					var minDist = minDistance != null ? minDistance : 0,
						vector = point.subtract(this._point),
						distance = vector.getLength();
					if (distance < minDist)
						return false;
					var maxDist = maxDistance != null ? maxDistance : 0;
					if (maxDist != 0) {
						if (distance > maxDist) {
							point = this._point.add(vector.normalize(maxDist));
						} else if (matchMaxDistance) {
							return false;
						}
					}
				}
				if (needsChange && point.equals(this._point))
					return false;
			}
			this._lastPoint = start && type == 'mousemove' ? point : this._point;
			this._point = point;
			switch (type) {
			case 'mousedown':
				this._lastPoint = this._downPoint;
				this._downPoint = this._point;
				this._downCount++;
				break;
			case 'mouseup':
				this._lastPoint = this._downPoint;
				break;
			}
			this._count = start ? 0 : this._count + 1;
			return true;
		},

		_fireEvent: function(type, event) {
			var sets = paper.project._removeSets;
			if (sets) {
				if (type === 'mouseup')
					sets.mousedrag = null;
				var set = sets[type];
				if (set) {
					for (var id in set) {
						var item = set[id];
						for (var key in sets) {
							var other = sets[key];
							if (other && other != set)
								delete other[item._id];
						}
						item.remove();
					}
					sets[type] = null;
				}
			}
			return this.responds(type)
					&& this.fire(type, new ToolEvent(this, type, event));
		},

		_handleEvent: function(type, point, event) {
			paper = this._scope;
			var called = false;
			switch (type) {
			case 'mousedown':
				this._updateEvent(type, point, null, null, true, false, false);
				called = this._fireEvent(type, event);
				break;
			case 'mousedrag':
				var needsChange = false,
					matchMaxDistance = false;
				while (this._updateEvent(type, point, this.minDistance,
						this.maxDistance, false, needsChange, matchMaxDistance)) {
					called = this._fireEvent(type, event) || called;
					needsChange = true;
					matchMaxDistance = true;
				}
				break;
			case 'mouseup':
				if (!point.equals(this._point)
						&& this._updateEvent('mousedrag', point, this.minDistance,
								this.maxDistance, false, false, false)) {
					called = this._fireEvent('mousedrag', event);
				}
				this._updateEvent(type, point, null, this.maxDistance, false,
						false, false);
				called = this._fireEvent(type, event) || called;
				this._updateEvent(type, point, null, null, true, false, false);
				this._firstMove = true;
				break;
			case 'mousemove':
				while (this._updateEvent(type, point, this.minDistance,
						this.maxDistance, this._firstMove, true, false)) {
					called = this._fireEvent(type, event) || called;
					this._firstMove = false;
				}
				break;
			}
			if (called)
				event.preventDefault();
			return called;
		}

	});
	
	Tool._mouseButton = "leftclick";

	return Tool;
});
