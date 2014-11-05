define([
  './affinetransformation',
  './constants',
  'geomath/path/path',
  './vector2',
  './vectortools',
  'geomath/wave/wave'
], function(AffineTransformation, constants, Path, Vector2, VectorTools, Wave) {
  return {
    AffineTransformation: AffineTransformation,
    constants: constants,
    Path: Path,
    Vector2: Vector2,
    VectorTools: VectorTools,
    Wave: Wave
  };
});
