define([
	'require',
	'num/num',
	"behaviour/trait",
	"behaviour/traits/itrait",
	"engine/time/timer"
], function(require, num, Trait, ITrait, Timer) {
    var Vector2 = require('num/num').Vector2;

	var jumpingCrate = ITrait.subclass({
		initialize: function() {
			this.jumpTimer =  new Timer(5);
		},
		update: function jump(entity) {
	        var body;

			if(this.jumpTimer.get() > 0) {
				this.jumpTimer.reset();
				body = entity.getBody();
				body.addGlobalForce(body.getDerivedPosition().add(new Vector2(0.1, 0)), new Vector2(0, 1000));
			}
			
			// add additional force, if clicked on crate
			if(entity.isClicked()) {
				body = entity.getBody();
				body.addGlobalForce(body.getDerivedPosition().add(new Vector2(0.1, 0)), new Vector2(1000, 0));
			} else if(entity.isHovered()) {
				// add additional force, if hovered over crate 
				body = entity.getBody();
				body.addGlobalForce(body.getDerivedPosition().add(new Vector2(0.1, 0)), new Vector2(0, 100));
			}
		}
	});

	return jumpingCrate;
});
