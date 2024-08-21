/**
 * follow path constraint to mimic the basic features of blender follow path constraint
 * path - Catmull curve
 * object - Object3D
 * offset - [0 -> -100]
 */

export const followPathConstraint = (path, object, offset) => {
  // change offset [0 -> -100] to [0 -> 1]

  const progress = Math.abs(offset) / 100;

  object.position.copy(path.getPointAt(progress));
};
