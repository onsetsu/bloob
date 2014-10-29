define([
  './affinetransformation',
  './vector2',
  './vectortools'
], function(AffineTransformation, Vector2, VectorTools) {
  return {
    AffineTransformation: AffineTransformation,
    Vector2: Vector2,
    VectorTools: VectorTools
  };
});
