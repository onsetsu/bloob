mini.Module(
	"basic/audio/audio"
)
.requires(
	"basic/interactionhandlerbuilder"
)
.defines(function() {
	var Audio = mini.Class.subclass({
		initialize: function() {
			this.buffers = {};
			this._initAudioGraph();
		},
		_initAudioGraph: function(datGui) {
			// init audio graph
			try {
				// Fix up for prefixing
				window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"];
				this.context = new window["AudioContext"]();
			}
			catch(e) {
				alert('Web Audio API is not supported in this browser');
				this.context = undefined;
			}

			// create parent nodes for sound and tracks
			this.trackParent = this.context.createGainNode();
			this.trackParent.connect(this.context.destination);
			this.soundParent = this.context.createGainNode();
			this.soundParent.connect(this.context.destination);
		}
	});

	return Audio;
});
