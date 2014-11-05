define(function(require) {
    var num = require('num/num'),
        AffineTransformation = num.AffineTransformation,
        Vector2 = num.Vector2
        VectorTools = num.VectorTools
        Path = num.Path;

	var ClosedShape = function(input) {
		this.mLocalVertices = input || []; // Vectorlist
	};
		
	ClosedShape.prototype.begin = function() {
		this.mLocalVertices.length = 0; // clear()
		return this;
	};

	ClosedShape.prototype.addVertex = function(vec) {
		this.mLocalVertices.push(vec);
		//return this.mLocalVertices.length;
		return this;
	};

	ClosedShape.prototype.finish = function(recenter) {
		recenter = recenter || true;

		if(recenter) {
			// find the average location of all of the vertices, this is our geometrical center.
			var center = Vector2.Zero.copy();
			
			for(var i = 0; i < this.mLocalVertices.length; i++)
				center.addSelf(this.mLocalVertices[i]);
			
			center.divFloatSelf(this.mLocalVertices.length);
			
			// now subtract this from each element, to get proper "local" coordinates.
			for (var i = 0; i < this.mLocalVertices.length; i++)
				this.mLocalVertices[i].subSelf(center);
		};
		return this;
	};

	ClosedShape.prototype.getVertices = function() { return this.mLocalVertices; };

	ClosedShape.prototype.transformVertices = function(worldPos, angleInRadians, scale, outList) {
        var transform = AffineTransformation.Identity.copy();
        transform.translateSelf(worldPos);
        transform.rotateSelf(angleInRadians * 180 / Math.PI, Vector2.Zero);
        transform.scaleSelf(scale);
		outList = outList || [];

		for(var i = 0; i < this.mLocalVertices.length; i++) {
			outList[i] = transform.transform(this.mLocalVertices[i]);;
		};
		
		return outList;
	};
	
	ClosedShape.prototype.toJson = function() {
		var resultJson = [];

		for(var i = 0; i < this.getVertices().length; i++)
			resultJson.push(this.getVertices()[i].toJson());

		return resultJson;
	};
	
	ClosedShape.fromJson = function(shapeJson) {
		var shape = new ClosedShape().begin();
		
		for(var index in shapeJson) {
			if(!shapeJson.hasOwnProperty(index)) continue;
			shape.addVertex(Vector2.fromJson(shapeJson[index]));
		};
		
		return shape.finish();
	};

	// enhance Path with converter method
    Path.prototype.toClosedShape = function () {
        var closedShape = new ClosedShape().begin();
        for(var i = 0; i < this.segments.length; i++) {
            closedShape.addVertex(this.get(i).point);
        }
        return closedShape.finish();
    };

	return ClosedShape;
});
