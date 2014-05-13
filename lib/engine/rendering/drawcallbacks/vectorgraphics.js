define([
	"engine/rendering/drawcallbacks/idrawcallback",
	"geomath/geomath",
	"engine/rendering/vector/text/areatext",
	"engine/rendering/vector/text/pathtext",
	"engine/rendering/vector/text/pointtext",
	"engine/rendering/drawcallback",
	"physics/jello"
], function(IDrawCallback, GeoMath, AreaText, PathText, PointText, DrawCallback, Jello) {

	return IDrawCallback.subclass({
		initialize: function() {
			this.pointText = new PointText(new Jello.Vector2(-40, 0), "HELLO BLOOB!!!");
			this.path = new GeoMath.Path()
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-20,   20), undefined, new Jello.Vector2(10, 10)))
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-20,    0), new Jello.Vector2(10,  -10), new Jello.Vector2(-5,  5)))
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-50,    0), new Jello.Vector2(3,  10), new Jello.Vector2(-9,  -30)))
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-50,   20), new Jello.Vector2(-1,  9), undefined))
				.remove(1)
				.lineBy(new Jello.Vector2(-10, 10))
				.cubicCurveBy(new Jello.Vector2(10, 15), new Jello.Vector2(20, 15), new Jello.Vector2(30, 0))
				.cubicCurveTo(new Jello.Vector2(10, 40), new Jello.Vector2(10, 40), new Jello.Vector2(20, 30))
				.quadraticCurveTo(new Jello.Vector2(30, 40), new Jello.Vector2(40, 30))
				.quadraticCurveBy(new Jello.Vector2(10, 10), new Jello.Vector2(20, 0))
				.close(true);
			this.path2 = new GeoMath.Path()
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-90, 0)))
				.curveTo(new Jello.Vector2(-80, 10), new Jello.Vector2(-70, 0), 0.8)
				.curveBy(new Jello.Vector2(-10, -10), new Jello.Vector2(-20, 0), 0.2);
			this.smoothedPath = new GeoMath.Path()
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-60, 0)))
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-50, 10)))
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-40, 0)))
				.close(true)
				.smooth();
			this.simplifiedPath = new GeoMath.Path()
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-30, 0)))
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-29, 0)))
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-28, 1)))
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-27, 3)))
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-26, 4)))
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-25, 4.5)))
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-24, 4)))
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-23, 3)))
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-22, 1)))
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-21, 0)))
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-20, 0)))
				.simplify(2.5);
			this.flattenedPath = new GeoMath.Path()
				.add(new GeoMath.Path.Segment(new Jello.Vector2(-60, -20)))
				.cubicCurveBy(new Jello.Vector2(0, 20), new Jello.Vector2(30, 20), new Jello.Vector2(30, 0))
				.cubicCurveBy(new Jello.Vector2(0, -20), new Jello.Vector2(30, -20), new Jello.Vector2(30, 0))
				.flatten(3);
			this.wavePath =  new GeoMath.Path();
			this.wavePath2 =  new GeoMath.Path();
			this.sineWave = new GeoMath.Wave.SineWave(10, 1, 0, 0);
			this.sineWave2 = new GeoMath.Wave.TriangleWave(10, 1, 0, 0);
		},
		draw: function(entity, renderer) {
			this.pointText.draw();
			this.path.draw();
			this.path2.draw();
			this.smoothedPath.draw();
			this.simplifiedPath.draw();
			this.flattenedPath.draw();
			
			var waveValue = this.sineWave.update(env.time.timePassed);
			this.wavePath.add(new GeoMath.Path.Segment(new Jello.Vector2(this.sineWave.x, waveValue))).draw();
			var waveValue = this.sineWave2.update(env.time.timePassed);
			this.wavePath2.add(new GeoMath.Path.Segment(new Jello.Vector2(this.sineWave2.x, waveValue))).draw();
		}
	});
	
});
