define([
	'require',
	'engine/game',
	"basic/utils",
	//'impact.background-map',
	'editor/script/config',
	'editor/script/tile-select',
	'editor/script/entities'
], function(
	require,
	Game,
	Utils,
	// BackGroundMap,
	Config,
	TileSelect,
	WrappedEntityRepository // TODO: for now this is undefined
){ "use strict";
	var wm = require('./../wm');

wm.EditEntities = mini.Class.subclass({
	visible: true,
	active: true,
	
	div: null,
	hotkey: -1,
	ignoreLastClick: false,
	name: 'entities',
	
	entities: [],
	namedEntities: {},
	selectedEntity: null,
	entityClasses: {},
	menuDiv: null,
	selector: {size:{x:2, y:2}, pos:{x:0,y:0}, offset:{x:0,y:0}},
	wasSelectedOnScaleBorder: false,
	gridSize: wm.config.entityGrid,
	entityDefinitions: null,
	
	
	
	initialize: function( div ) {
		this.div = div;
		div.bind( 'mouseup', this.click.bind(this) );
		this.div.children('.visible').bind( 'mousedown', this.toggleVisibilityClick.bind(this) );
		
		this.menu = $('#entityMenu');
		this.importEntityClass( WrappedEntityRepository );
		this.entityDefinitions = $('#entityDefinitions');
		
		$('#entityKey').bind( 'keydown', function(ev){ 
			if( ev.which == 13 ){ 
				$('#entityValue').focus(); 
				return false;
			}
			return true;
		});
		$('#entityValue').bind( 'keydown', this.setEntitySetting.bind(this) );
	},
	
	
	clear: function() {
		this.entities = [];
		this.selectEntity( null );
	},
	
	
	sort: function() {
		//this.entities.sort( ig.Game.SORT.Z_INDEX );
	},
	
	
	
	
	// -------------------------------------------------------------------------
	// Loading, Saving
	
	
	importEntityClass: function( modules ) { // WrappedEntityRepository
		var that = this;
		Utils.Object.each(modules.classes, function(entityClassName, entityClass) {
			var className = entityClassName;
			var entityName = className.replace(/^Entity/, '');
		
			// Ignore entities that have the _wmIgnore flag
			if( !entityClass.prototype._wmIgnore  ) {
				var a = $( '<div/>', {
					'id': className,
					'href': '#',
					'html': entityName,
					'mouseup': that.newEntityClick.bind(that)
				});
				that.menu.append( a );
				that.entityClasses[className] = entityClass; // m
			}
		});
	},
	
	
	getEntityByName: function( name ) {
		return this.namedEntities[name];
	},
	
	
	getSaveData: function() {
		var ents = [];
		for( var i = 0; i < this.entities.length; i++ ) {
			var ent = this.entities[i];
			var type = ent._wmClassName;
			var data = {type:type,x:ent.pos.x,y:ent.pos.y};
			
			var hasSettings = false;
			for( var p in ent._wmSettings ) {
				if(!ent._wmSettings.hasOwnProperty(p)) continue;

				hasSettings = true;
			}
			if( hasSettings ) {
				data.settings = ent._wmSettings;
			}
			
			ents.push( data );
		}
		return ents;
	},		
	
	
	
	
	// -------------------------------------------------------------------------
	// Selecting
	
	
	selectEntityAt: function( worldPoint ) {
		this.selector.pos = { x: worldPoint.x, y: worldPoint.y };
		
		var entities = env.editor.activeLayer.getEntities();
		for( var i = 0; i < entities.length; i++ ) {
			var ent = entities[i];
			if( ent.contains(this.selector.pos) ) {
				this.selector.offset = {x: (worldPoint.x - ent.pos.x + ent.offset.x), y: (worldPoint.y - ent.pos.y + ent.offset.y)};
				this.selectEntity( ent );
				//this.wasSelectedOnScaleBorder = this.isOnScaleBorder( ent, this.selector );
				return ent;
			}
		}
		this.selectEntity( null );
		return false;
	},
	
	
	selectEntity: function( entity ) {
		if( entity && entity != this.selectedEntity ) {
			this.selectedEntity = entity;
			$('#layerSettings').fadeOut(100,(function(){
				$('#entitySettings').fadeOut(100,(function(){
					this.loadEntitySettings();
					$('#entitySettings').fadeIn(100);
				}).bind(this));
			}).bind(this));
		} 
		else if( !entity ) {
			$('#entitySettings').fadeOut(100);
			$('#entityKey').blur();
			$('#entityValue').blur();
		}
		
		this.selectedEntity = entity;
		$('#entityKey').val('');
		$('#entityValue').val('');
	},

	
	// -------------------------------------------------------------------------
	// Creating, Deleting, Moving
	
	
	deleteSelectedEntity: function() {
		if( !this.selectedEntity ) {
			return false;
		}
		
		ig.game.undo.commitEntityDelete( this.selectedEntity );
		
		this.removeEntity( this.selectedEntity );
		this.selectEntity( null );
		return true;
	},
	
	
	removeEntity: function( ent ) {
		if( ent.name ) {
			delete this.namedEntities[ent.name];
		}
		this.entities.erase( ent );
	},
	
	
	cloneSelectedEntity: function() {
		if( !this.selectedEntity ) {
			return false;
		}
		
		var className = this.selectedEntity._wmClassName;
		var settings = ig.copy(this.selectedEntity._wmSettings);
		if( settings.name ) {
			settings.name = settings.name + '_clone';
		}
		var x = this.selectedEntity.pos.x + this.gridSize;
		var y = this.selectedEntity.pos.y;
		var newEntity = this.spawnEntity( className, settings.name, x, y, settings );
		newEntity._wmSettings = settings;
		this.selectEntity( newEntity );
		
		ig.game.undo.commitEntityCreate( newEntity );
		
		return true;
	},
	
	
	dragOnSelectedEntity: function( x, y ) {
		if( !this.selectedEntity ) {
			return false;
		}
		
		
		// scale or move?
		if( this.selectedEntity._wmScalable && this.wasSelectedOnScaleBorder ) {
			this.scaleSelectedEntity( x, y );	
		}
		else {
			this.moveSelectedEntity( x, y );
		}
		
		ig.game.undo.pushEntityEdit( this.selectedEntity );
		return true;
	},
	
	
	moveSelectedEntity: function( x, y ) {
		x = 
			Math.round( (x - this.selector.offset.x ) / this.gridSize ) *
			this.gridSize + this.selectedEntity.offset.x;
		y = 
			Math.round( (y - this.selector.offset.y ) / this.gridSize ) *
			this.gridSize + this.selectedEntity.offset.y;
		
		// new position?
		if( this.selectedEntity.pos.x != x || this.selectedEntity.pos.y != y ) {
			$('#entityDefinitionPosX').text( x );
			$('#entityDefinitionPosY').text( y );
			
			this.selectedEntity.pos.x = x;
			this.selectedEntity.pos.y = y;
		}
	},
	
	
	scaleSelectedEntity: function( x, y ) {
	    var h, w;
		var scale = this.wasSelectedOnScaleBorder;
			
		w = Math.round( x / this.gridSize ) * this.gridSize - this.selectedEntity.pos.x;
		
		if( !this.selectedEntity._wmSettings.size ) {
			this.selectedEntity._wmSettings.size = {};
		}
		
		if( scale == 'n' ) {
			h = this.selectedEntity.pos.y - Math.round( y / this.gridSize ) * this.gridSize;
			if( this.selectedEntity.size.y + h <= this.gridSize ) {
				h = (this.selectedEntity.size.y - this.gridSize) * -1;
			}
			this.selectedEntity.size.y += h;
			this.selectedEntity.pos.y -= h;
		}
		else if( scale == 's' ) {
			h = Math.round( y / this.gridSize ) * this.gridSize - this.selectedEntity.pos.y;
			this.selectedEntity.size.y = Math.max( this.gridSize, h );
		}
		else if( scale == 'e' ) {
			w = Math.round( x / this.gridSize ) * this.gridSize - this.selectedEntity.pos.x;
			this.selectedEntity.size.x = Math.max( this.gridSize, w );
		}
		else if( scale == 'w' ) {
			w = this.selectedEntity.pos.x - Math.round( x / this.gridSize ) * this.gridSize;
			if( this.selectedEntity.size.x + w <= this.gridSize ) {
				w = (this.selectedEntity.size.x - this.gridSize) * -1;
			}
			this.selectedEntity.size.x += w;
			this.selectedEntity.pos.x -= w;
		}
		this.selectedEntity._wmSettings.size.x = this.selectedEntity.size.x;
		this.selectedEntity._wmSettings.size.y = this.selectedEntity.size.y;
		
		this.loadEntitySettings();
	},
	
	
	newEntityClick: function( ev ) {
		this.hideMenu();
		var newEntity = this.spawnEntity( ev.target.id, this.selector.pos.x, this.selector.pos.y, {} );
		this.selectEntity( newEntity );
		//this.moveSelectedEntity( this.selector.pos.x, this.selector.pos.y );
		env.editor.setModified();
		
		//ig.game.undo.commitEntityCreate( newEntity );
	},
	
	
	spawnEntity: function( className, x, y, settings ) {
		settings = settings || {};
		var EntityClass = WrappedEntityRepository.classes[className]; //ig.global[ className ];
		console.log("EntityClass", EntityClass, className);
		if( EntityClass ) {
			var newEntity = new (EntityClass)( x, y, settings );
			env.editor.activeLayer.addEntity(newEntity);
			newEntity._wmInEditor = true;
			newEntity._wmClassName = className;
			newEntity._wmSettings = {};
			for( var s in settings ) {
				if(!settings.hasOwnProperty(s)) continue;
				
				newEntity._wmSettings[s] = settings[s];
			}
			this.entities.push( newEntity );
			if( settings.name ) {
				this.namedEntities[settings.name] = newEntity;
			}
			//this.sort();
			return newEntity;
		}
		return null;
	},
	
	
	isOnScaleBorder: function( entity, selector ) {	
		var border = 2;
		var w = selector.pos.x - entity.pos.x;
		var h = selector.pos.y - entity.pos.y;
		
		if( w < border ) return 'w';
		if( w > entity.size.x - border ) return 'e';
		
		if( h < border ) return 'n';
		if( h > entity.size.y - border ) return 's';
		
		return false;
	},
	
	
	
	
	// -------------------------------------------------------------------------
	// Settings
	
	
	loadEntitySettings: function(ent) {
		
		if( !this.selectedEntity ) {
			return;
		}
		var html = 
			'<div class="entityDefinition"><span class="key">x</span>:<span class="value" id="entityDefinitionPosX">'+this.selectedEntity./*pos.*/x+'</span></div>' +
			'<div class="entityDefinition"><span class="key">y</span>:<span class="value" id="entityDefinitionPosY">'+this.selectedEntity/*.pos*/.y+'</span></div>';
		
		html += this.loadEntitySettingsRecursive( this.selectedEntity._wmSettings );
		this.entityDefinitions.html( html );
		
		var className = this.selectedEntity._wmClassName.replace(/^Entity/, '');
		$('#entityClass').text( className );
		
		$('.entityDefinition').bind( 'mouseup', this.selectEntitySetting );
	},
	
	
	loadEntitySettingsRecursive: function( settings, path ) {
		path = path || "";
		var html = "";
		for( var key in settings ) {
			if(!settings.hasOwnProperty(key)) continue;

			var value = settings[key];
			if( typeof(value) == 'object' ) {
				html += this.loadEntitySettingsRecursive( value, path + key + "." );
			}
			else {
				html += '<div class="entityDefinition"><span class="key">'+path+key+'</span>:<span class="value">'+value+'</span></div>';
			}
		}
		
		return html;
	},
	
	
	setEntitySetting: function( ev ) {
		if( ev.which != 13 ) {
			return true;
		}
		var key = $('#entityKey').val();
		var value = $('#entityValue').val();
		var floatVal = parseFloat(value);
		if( value == floatVal ) {
			value = floatVal;
		}
		
		if( key == 'name' ) {
			if( this.selectedEntity.name ) {
				delete this.namedEntities[this.selectedEntity.name];
			}
			this.namedEntities[ value ] = this.selectedEntity;
		}
		
		if( key == 'x' ) {
			this.selectedEntity.pos.x = Math.round(value);
		}
		else if( key == 'y' ) {
			this.selectedEntity.pos.y = Math.round(value);
		}
		else {
			this.writeSettingAtPath( this.selectedEntity._wmSettings, key, value );
			Utils.Object.merge( this.selectedEntity, this.selectedEntity._wmSettings );
		}
		
		this.sort();
		
		env.game.setModified();
		env.game.draw();
		
		$('#entityKey').val('');
		$('#entityValue').val('');
		$('#entityValue').blur();
		this.loadEntitySettings();
		
		$('#entityKey').focus(); 
		return false;
	},
	
	
	writeSettingAtPath: function( root, path, value ) {
		path = path.split('.');
		var cur = root;
		for( var i = 0; i < path.length; i++ ) {
			var n = path[i];
			if( i < path.length-1 && typeof(cur[n]) != 'object' ) {
				cur[n] = {};
			}
			
			if( i == path.length-1 ) {
				cur[n] = value;
			}
			cur = cur[n];		
		}
		
		this.trimObject( root );
	},
	
	
	trimObject: function( obj ) {
		var isEmpty = true;
		for( var i in obj ) {
			if(!obj.hasOwnProperty(i)) continue;

			if(
			   (obj[i] === "") ||
			   (typeof(obj[i]) == 'object' && this.trimObject(obj[i]))
			) {
				delete obj[i];
			}
			
			if( typeof(obj[i]) != 'undefined' ) {
				isEmpty = false;
			}
		}
		
		return isEmpty;
	},
	
	
	selectEntitySetting: function( ev ) {
		$('#entityKey').val( $(this).children('.key').text() );
		$('#entityValue').val( $(this).children('.value').text() );
		$('#entityValue').select();
	},
	
	
	
	
	
	
	// -------------------------------------------------------------------------
	// UI
	
	setHotkey: function( hotkey ) {
		this.hotkey = hotkey;
		this.div.attr('title', 'Select Layer ('+this.hotkey+')' );
	},
	
	
	showMenu: function( x, y ) {
		var worldXY = env.camera.screenToWorldCoordinates(new Vector2(x, y));
		this.selector.pos = { 
			x: worldXY.x,//Math.round( (x + ig.editor.screen.x) / this.gridSize ) * this.gridSize, 
			y: worldXY.y//Math.round( (y + ig.editor.screen.y) / this.gridSize ) * this.gridSize
		};
		this.menu.css({top: (y * 1/*ig.system.scale*/ + 2), left: (x * 1/*ig.system.scale*/ + 2) });
		this.menu.show();
	},
	
	
	hideMenu: function( x, y ) {
		env.editor.mode = env.editor.MODE.DEFAULT;
		this.menu.hide();
	},
	
	
	setActive: function( active ) {
		this.active = active;
		if( active ) {
			this.div.addClass( 'layerActive' );
		} else {
			this.div.removeClass( 'layerActive' );
		}
	},
	
	
	toggleVisibility: function() {
		this.visible ^= 1;
		if( this.visible ) {
			this.div.children('.visible').addClass('checkedVis');
		} else {
			this.div.children('.visible').removeClass('checkedVis');
		}
		ig.game.draw();
	},
	
	
	toggleVisibilityClick: function( ev ) {
		if( !this.active ) {
			this.ignoreLastClick = true;
		}
		this.toggleVisibility();
	},
	
	
	click: function() {
		if( this.ignoreLastClick ) {
			this.ignoreLastClick = false;
			return;
		}
		ig.editor.setActiveLayer( 'entities' );
	},
	
	
	mousemove: function( x, y ) {
		this.selector.pos = { x: x, y: y };
		
		if( this.selectedEntity ) {
			if( this.selectedEntity._wmScalable && this.selectedEntity.touches(this.selector) ) {
				var scale = this.isOnScaleBorder( this.selectedEntity, this.selector );
				if( scale == 'n' || scale == 's' ) {
					$('body').css('cursor', 'n-resize');
					return;
				}
				else if( scale == 'e' || scale == 'w' ) {
					$('body').css('cursor', 'e-resize');
					return;
				}
			}
		}
		
		$('body').css('cursor', 'default');
	},
	
	
	
	
	
	
	// -------------------------------------------------------------------------
	// Drawing
	
	
	draw: function() {
		if( this.visible ) {
			for( var i = 0; i < this.entities.length; i++ ) {
				this.drawEntity( this.entities[i] );
			}
		}
	},
	
	
	drawEntity: function( ent ) {
		
		// entity itself
		ent.draw();
		
		// box
		if( ent._wmDrawBox ) {
			ig.system.context.fillStyle = ent._wmBoxColor || 'rgba(128, 128, 128, 0.9)';
			ig.system.context.fillRect(
				ig.system.getDrawPos(ent.pos.x - ig.game.screen.x),
				ig.system.getDrawPos(ent.pos.y - ig.game.screen.y), 
				ent.size.x * ig.system.scale, 
				ent.size.y * ig.system.scale
			);
		}
		
		
		if( wm.config.labels.draw ) {
			// description
			var className = ent._wmClassName.replace(/^Entity/, '');
			var description = className + (ent.name ? ': ' + ent.name : '' );
			
			// text-shadow
			ig.system.context.fillStyle = 'rgba(0,0,0,0.4)';
			ig.system.context.fillText(
				description,
				ig.system.getDrawPos(ent.pos.x - ig.game.screen.x), 
				ig.system.getDrawPos(ent.pos.y - ig.game.screen.y + 0.5)
			);
			
			// text
			ig.system.context.fillStyle = wm.config.colors.primary;
			ig.system.context.fillText(
				description,
				ig.system.getDrawPos(ent.pos.x - ig.game.screen.x), 
				ig.system.getDrawPos(ent.pos.y - ig.game.screen.y)
			);
		}

		
		// line to targets
		if( typeof(ent.target) == 'object' ) {
			for( var t in ent.target ) {
				if(!ent.target.hasOwnProperty(t)) continue;
				
				this.drawLineToTarget( ent, ent.target[t] );
			}
		}
	},

	
	drawLineToTarget: function( ent, target ) {
		target = ig.game.getEntityByName( target );
		if( !target ) {
			return;
		}
		
		ig.system.context.strokeStyle = '#fff';
		ig.system.context.lineWidth = 1;
		
		ig.system.context.beginPath();
		ig.system.context.moveTo(
			ig.system.getDrawPos(ent.pos.x + ent.size.x/2 - ig.game.screen.x),
			ig.system.getDrawPos(ent.pos.y + ent.size.y/2 - ig.game.screen.y)
		);
		ig.system.context.lineTo(
			ig.system.getDrawPos(target.pos.x + target.size.x/2 - ig.game.screen.x),
			ig.system.getDrawPos(target.pos.y + target.size.y/2 - ig.game.screen.y)
		);
		ig.system.context.stroke();
		ig.system.context.closePath();
	},
	
	
	drawCursor: function( x, y ) {
		if( this.selectedEntity ) {
			ig.system.context.lineWidth = 1;
			ig.system.context.strokeStyle = wm.config.colors.highlight;
			ig.system.context.strokeRect( 
				ig.system.getDrawPos(this.selectedEntity.pos.x - ig.editor.screen.x) - 0.5, 
				ig.system.getDrawPos(this.selectedEntity.pos.y - ig.editor.screen.y) - 0.5, 
				this.selectedEntity.size.x * ig.system.scale + 1, 
				this.selectedEntity.size.y * ig.system.scale + 1
			);
		}
	}
});

return wm.EditEntities;

});