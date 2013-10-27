mini.Module(
	'debug/menu'
)
.requires(
	"engine/firefly"
)
.defines(function(ff){ "use strict";

ff.DebugPanel = mini.Class.subclass({
	active: false,
	container: null,
	options: [],
	panels: [],
	label: '',
	name: '',
	
	
	init: function( name, label ) {
		this.name = name;
		this.label = label;
		this.container = $('<div />');
		this.container.addClass('ig_debug_panel ' + this.name);
	},
	
	
	toggle: function( active ) {
		this.active = active;
		this.container.style("display", active ? 'block' : 'none');
	},
	
	
	addPanel: function( panel ) {
		this.panels.push( panel );
		this.container.append( panel.container );
	},
	
	
	addOption: function( option ) {
		this.options.push( option );
		this.container.append( option.container );
	},
	
	
	ready: function(){},
	beforeRun: function(){},
	afterRun: function(){}
});

});