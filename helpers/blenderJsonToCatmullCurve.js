import { CatmullRomCurve3 } from "three";
import { Vector3 } from "three";

export const blenderJsonToCatmullCurve = (json) => {
  const points = json.points.map(
    (point) => new Vector3(point.x, point.y, point.z)
  );

  return new CatmullRomCurve3(points);
};
