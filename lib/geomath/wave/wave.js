define(["physics/jello"], function(Jello) {
	
	var PI = Jello.JellyPrerequisites.PI;
	
	var Wave = mini.Class.subclass({
		initialize: function(amplitude, frequency, phase, offset) {
			this.amplitude = amplitude;
			this.frequency = frequency;
			this.phase = phase;
			this.offset = offset;
			
			this.x = 0;
		}
	});
	
	var SineWave = Wave.subclass({
		update: function (deltaTime) {
			this.x += deltaTime;
			
			return this.amplitude * Math.sin(this.frequency * this.x + this.phase) + this.offset;
		}
	});
	
	var TriangleWave = Wave.subclass({
		update: function (deltaTime) {
			this.x += deltaTime;
			
			return (2 * this.amplitude / PI) * Math.asin(Math.sin(this.frequency * this.x + this.phase)) + this.offset;
		}
	});
	
	Wave.SineWave = SineWave;
	Wave.TriangleWave = TriangleWave;

	return Wave;
});
