define([
	'require',
	'num/num',
	"engine/rendering/drawcallbacks/idrawcallback",
	"engine/rendering/vector/text/areatext",
	"engine/rendering/vector/text/pathtext",
	"engine/rendering/vector/text/pointtext",
	"engine/rendering/drawcallback"
], function(
    require,
    num,
    IDrawCallback,
    AreaText,
    PathText,
    PointText,
    DrawCallback
) {
    var num = require('num/num'),
        Path = num.Path,
        Vector2 = num.Vector2,
        Wave = num.Wave;

	return IDrawCallback.subclass({
		initialize: function() {
			this.pointText = new PointText(new Vector2(-40, 0), "HELLO BLOOB!!!");
			this.path = new Path()
				.add(new Path.Segment(new Vector2(-20,   20), undefined, new Vector2(10, 10)))
				.add(new Path.Segment(new Vector2(-20,    0), new Vector2(10,  -10), new Vector2(-5,  5)))
				.add(new Path.Segment(new Vector2(-50,    0), new Vector2(3,  10), new Vector2(-9,  -30)))
				.add(new Path.Segment(new Vector2(-50,   20), new Vector2(-1,  9), undefined))
				.remove(1)
				.lineBy(new Vector2(-10, 10))
				.cubicCurveBy(new Vector2(10, 15), new Vector2(20, 15), new Vector2(30, 0))
				.cubicCurveTo(new Vector2(10, 40), new Vector2(10, 40), new Vector2(20, 30))
				.quadraticCurveTo(new Vector2(30, 40), new Vector2(40, 30))
				.quadraticCurveBy(new Vector2(10, 10), new Vector2(20, 0))
				.close(true);
			this.path2 = new Path()
				.add(new Path.Segment(new Vector2(-90, 0)))
				.curveTo(new Vector2(-80, 10), new Vector2(-70, 0), 0.8)
				.curveBy(new Vector2(-10, -10), new Vector2(-20, 0), 0.2);
			this.insertPath = new Path()
				.add(new Path.Segment(new Vector2(10, 25)))
				.add(new Path.Segment(new Vector2(30, 25)))
				.insert(new Path.Segment(new Vector2(20, 10)), 1);
			this.arcPath = new Path()
				.add(new Path.Segment(new Vector2(0, 0)))
				.arcBy(new Vector2(10, 5), new Vector2(20,  0))
				.arcBy(new Vector2(10, 10), new Vector2(20,  0))
				.arcBy(new Vector2(10, 15), new Vector2(20,  0))
				.arcBy(new Vector2(10, 20), new Vector2(20,  0))
				.arcBy(new Vector2(15, 20), new Vector2(20,  0))
				.arcBy(new Vector2(20, 20), new Vector2(20,  0))
				.arcBy(new Vector2(25, 20), new Vector2(20,  0))
				.arcBy(new Vector2(35, 20), new Vector2(20,  0));
			this.smoothedPath = new Path()
				.add(new Path.Segment(new Vector2(-60, 0)))
				.add(new Path.Segment(new Vector2(-50, 10)))
				.add(new Path.Segment(new Vector2(-40, 0)))
				.close(true)
				.smooth();
			this.simplifiedPath = new Path()
				.add(new Path.Segment(new Vector2(-30, 0)))
				.add(new Path.Segment(new Vector2(-29, 0)))
				.add(new Path.Segment(new Vector2(-28, 1)))
				.add(new Path.Segment(new Vector2(-27, 3)))
				.add(new Path.Segment(new Vector2(-26, 4)))
				.add(new Path.Segment(new Vector2(-25, 4.5)))
				.add(new Path.Segment(new Vector2(-24, 4)))
				.add(new Path.Segment(new Vector2(-23, 3)))
				.add(new Path.Segment(new Vector2(-22, 1)))
				.add(new Path.Segment(new Vector2(-21, 0)))
				.add(new Path.Segment(new Vector2(-20, 0)))
				.simplify(2.5);
			this.flattenedPath = new Path()
				.add(new Path.Segment(new Vector2(-60, -20)))
				.cubicCurveBy(new Vector2(0, 20), new Vector2(30, 20), new Vector2(30, 0))
				.cubicCurveBy(new Vector2(0, -20), new Vector2(30, -20), new Vector2(30, 0))
				.flatten(3);
			this.wavePath =  new Path();
			this.wavePath2 =  new Path();
			this.wave = new Wave.SineWave(10, 0.25, -1, 0);
			this.wave2 = new Wave.SawToothWave(10, 0.25,-1, 0);
		},
		draw: function(entity, renderer) {
			this.pointText.draw();
			this.path.draw();
			this.path2.draw();
			this.insertPath.draw();
			this.arcPath.draw();
			this.smoothedPath.draw();
			this.simplifiedPath.draw();
			this.flattenedPath.draw();
			
			var waveValue = this.wave.update(env.time.timePassed);
			this.wavePath.add(new Path.Segment(new Vector2(this.wave.x, waveValue))).draw();
			if(this.wavePath.segments.length > 100) this.wavePath.remove(0);
			var waveValue = this.wave2.update(env.time.timePassed);
			this.wavePath2.add(new Path.Segment(new Vector2(this.wave2.x, waveValue))).draw();
			if(this.wavePath2.segments.length > 100) this.wavePath2.remove(0);
		}
	});
	
});
