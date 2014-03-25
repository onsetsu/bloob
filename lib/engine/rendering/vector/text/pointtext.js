define([

], function() {
	var PointText = mini.Class.subclass({
		initialize: function(vector, text) {
			this.point = vector;
			this.text = text;
		},
		
		draw: function() {
			env.renderer.setOptions({
				"color": "#00ff00",
				"opacity": 1
			});
			env.renderer.context.textBaseline = 'bottom';

			env.renderer.drawTextWorld(this.text, this.point);
		}
	});
	
	return PointText;
});
