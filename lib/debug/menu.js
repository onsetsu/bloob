mini.Module(
	'debug/menu'
)
.requires(
	"engine/loop",
	"engine/game",
	'engine/domready',
	"debug/option"
)
.defines(function(Loop, Game, domReady, DebugOption){ "use strict";

domReady(function() {
	
var loopUpdate = Loop.prototype.update;
Loop.inject({
	update: function() {
		Bloob.debug.beforeRun();
		loopUpdate.apply(this, arguments);
		Bloob.debug.afterRun();
	}
});

var gameInitialize = Game.prototype.initialize;
Game.inject({
	update: function() {
		gameInitialize.apply(this, arguments);
		Bloob.debug.ready();
	}
});

Bloob.Debug = mini.Class.subclass({
	options: {},
	panels: {},
	numbers:{},
	container: null,
	panelMenu: null,
	activePanel: null,
	
	debugTime: 0,
	debugTickAvg: 0.016,
	debugRealTime: Date.now(),
	
	initialize: function() {
		// Inject the Stylesheet
		var style = $("<link />");
		console.log(style);
		style.attr("rel", 'stylesheet');
		style.attr("type", 'text/css');
		style.attr("href", 'lib/debug/debug.css');
		$("body").append(style);

		// Create the Debug Container
		this.container = $('<div />');
		this.container.addClass("ig_debug");
		$("body").prepend( this.container );
		
		// Create and add the Menu Container
		this.panelMenu = $('<div />');
		this.panelMenu.innerHTML = '<div class="ig_debug_head">Impact.Debug:</div>';
		this.panelMenu.addClass("ig_debug_panel_menu");
		
		this.container.append( this.panelMenu );
		
		// Create and add the Stats Container
		this.numberContainer = $('<div />');
		this.numberContainer.addClass('ig_debug_stats');
		this.panelMenu.append( this.numberContainer );
		
		// Set Bloob.log(), Bloob.assert() and Bloob.show()
		if( window.console && window.console.log && window.console.assert ) {
			// Can't use .bind() on native functions in IE9 :/
			Bloob.log = console.log.bind ? console.log.bind(console) : console.log;
			Bloob.assert = console.assert.bind ? console.assert.bind(console) : console.assert;
		}
		var that = this;
		Bloob.show = function() {
			that.showNumber.apply(that, arguments);
		};
	},
	
	
	addNumber: function( name, width ) {
		var number = $('<span />');		
		this.numberContainer.append( number );
		this.numberContainer.append( document.createTextNode(name) );
		
		this.numbers[name] = number;
	},
	
	
	showNumber: function( name, number, width ) {
		if( !this.numbers[name] ) {
			this.addNumber( name, width );
		}
		this.numbers[name].text(number);
	},
	
	
	addPanel: function( panelDef ) {
		// Create the panel and options
		var panel = new (panelDef.type)( panelDef.name, panelDef.label );
		if( panelDef.options ) {
			for( var i = 0; i < panelDef.options.length; i++ ) {
				var opt = panelDef.options[i];
				panel.addOption( new DebugOption(opt.name, opt.object, opt.property) );
			}
		}
		
		this.panels[ panel.name ] = panel;
		panel.container.hide();//.css("display", 'none');
		this.container.append( panel.container );
		
		var that = this;
		// Create the menu item
		var menuItem = $('<div />');
		menuItem.addClass('ig_debug_menu_item');
		menuItem.text(panel.label);
		menuItem.click(function(ev) {
			that.togglePanel(panel);
		});
		panel.menuItem = menuItem;
		
		// Insert menu item in alphabetical order into the menu
		var inserted = false;
		for( var i = 1; i < this.panelMenu.children().length; i++ ) {
			var cn = this.panelMenu.children()[i];
			if( cn.textContent > panel.label ) {
				menuItem.insertBefore( cn );
				inserted = true;
				break;
			}
		}
		if( !inserted ) {
			// Not inserted? Append at the end!
			this.panelMenu.append( menuItem );
		}
	},
	
	
	showPanel: function( name ) {
		this.togglePanel( this.panels[name] );
	},
	
	
	togglePanel: function( panel ) {
		if( panel != this.activePanel && this.activePanel ) {
			this.activePanel.toggle( false );
			this.activePanel.menuItem.addClass('ig_debug_menu_item');
			this.activePanel.menuItem.removeClass('active');
			this.activePanel = null;
		}
		
		var active = !(panel.container.is(":visible"));
		panel.toggle( active );
		panel.menuItem.addClass('ig_debug_menu_item');
		if(active) {
			panel.container.show();
			panel.menuItem.addClass('active');
		} else {
			panel.container.hide();
			panel.menuItem.removeClass('active');
		}

		if( active ) {
			this.activePanel = panel;
		}
	},
	
	
	ready: function() {
		for( var p in this.panels ) {
			if(!this.panels.hasOwnProperty(p)) continue;

			this.panels[p].ready();
		}
	},
	
	
	beforeRun: function() {
		var timeBeforeRun = Date.now();
		this.debugTickAvg = this.debugTickAvg * 0.8 + (timeBeforeRun - this.debugRealTime) * 0.2;
		this.debugRealTime = timeBeforeRun;
		
		if( this.activePanel ) {
			this.activePanel.beforeRun();
		}
	},
	
	
	afterRun: function() {
		var frameTime = Date.now() - this.debugRealTime;
		
		this.debugTime = this.debugTime * 0.8 + frameTime * 0.2;
		
		if( this.activePanel ) {
			this.activePanel.afterRun();
		}
		
		this.showNumber( 'ms',  this.debugTime.toFixed(2) );
		this.showNumber( 'fps',  Math.round(1000/this.debugTickAvg) );
		this.showNumber( 'draws', 0 /*ig.Image.drawCount*/ );
		if( env.game && env.game.entities ) {
			this.showNumber( 'entities', ig.game.entities.length );
		}
		//ig.Image.drawCount = 0;
	}
});

// Create the debug instance!
Bloob.debug = new Bloob.Debug();

});
});