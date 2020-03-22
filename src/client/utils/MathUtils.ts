import { Point } from "../../common/Structures";

export function pointIntersectsCircle(point: Point, circleCenter: Point, circleRadius: number) {
  return Math.sqrt((point.x - circleCenter.x) ** 2 + (point.y - circleCenter.y) ** 2) < circleRadius;
}