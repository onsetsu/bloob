define([
  './matrix3x3',
  'physics/vector2',
  'physics/vectortools'
], function(AffineTransformation, Vector2, VectorTools) {
  return {
    AffineTransformation: AffineTransformation,
    Vector2: Vector2,
    VectorTools: VectorTools
  };
});
