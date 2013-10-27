mini.Module(
	'debug/option'
)
.requires(
	"engine/firefly"
)
.defines(function(ff){ "use strict";

ff.DebugOption = mini.Class.subclass({
	name: '',
	labelName: '',
	className: 'ig_debug_option',
	label: null,
	mark: null,
	container: null,
	active: false,
	
	colors: {
		enabled: '#fff',
		disabled: '#444'
	},
	
	
	init: function( name, object, property ) {
		this.name = name;
		this.object = object;
		this.property = property;
		
		this.active = this.object[this.property];
		
		this.container = $('<div />');
		this.container.addClass('ig_debug_option');
		
		this.label = $('<span />');
		this.label.addClass('ig_debug_label');
		this.label.textContent = this.name;
		
		this.mark = $('<span />');
		this.mark.addClass('ig_debug_label_mark');
		
		this.container.append( this.mark );
		this.container.append( this.label );
		var that = this;
		this.container.addEventListener( 'click', function() {
			that.click.apply(that, arguments);
		}, false );
		
		this.setLabel();
	},
	
	
	setLabel: function() {
		this.mark.style("backgroundColor", this.active ? this.colors.enabled : this.colors.disabled);
	},
	
	
	click: function( ev ) {
		this.active = !this.active;
		this.object[this.property] = this.active;
		this.setLabel();
		
		ev.stopPropagation();
		ev.preventDefault();
		return false;
	}
});

return ff.DebugOption;

});