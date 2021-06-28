import ARROW from "../models/Arrow";
import { fabric } from "fabric";

export const initArrow = (canvas, point: { x: number, y: number }) => {
  const x = point.x;
  const y = point.y;

  const p0 = { x, y };  // 箭尾
  const p1 = { x, y: y + ARROW.LENGTH };  // 箭顶
  const p2 = { x: x + ARROW.HEAD.WIDTH / 2, y: p1.y };  // 箭头右
  const p3 = { x, y: p1.y + ARROW.HEAD.HEIGHT };  // 箭头
  const p4 = { x: x - ARROW.HEAD.WIDTH / 2, y: p1.y };  // 箭头左

  const points = [p0,p1,p2,p3,p4,p1];

  const arrow = new fabric.Polygon(points, {
    fill: ARROW.COLOR,
    stroke: ARROW.COLOR,
    selectable: false,
    objectCaching: false,
    strokeWidth: 2
  });

  canvas.add(arrow);
  canvas.renderAll();

  return arrow;
}

export const adjustArrow = (p: fabric.Object & { arrowDown: fabric.Polygon, arrowUp: fabric.Polygon }) => {
  if (p.arrowDown) {
    const arrow = p.arrowDown;
    const p0 = arrow.points[0];
    const x = p.oCoords.mb.x;
    const y = p.oCoords.mb.y;

    // 调整箭尾即可
    p0.x = x;
    p0.y = y;
  }

  if (p.arrowUp) {
    const arrow = p.arrowUp;
    const p1 = arrow.points[1];
    const p2 = arrow.points[2];
    const p3 = arrow.points[3];
    const p4 = arrow.points[4];
    const p5 = arrow.points[5];

    const x = p.oCoords.mt.x;
    const y = p.oCoords.mt.y;

    // 箭头
    p3.x = x;
    p3.y = y;

    // 箭顶
    p1.x = p3.x;
    p1.y = p3.y - ARROW.HEAD.HEIGHT;

    // 箭头右
    p2.x = p1.x + ARROW.HEAD.WIDTH / 2;
    p2.y = p1.y;

    // 箭头左
    p4.x = p1.x - ARROW.HEAD.WIDTH / 2;
    p4.y = p1.y;

    // 回到箭顶
    p5.x = p1.x;
    p5.y = p1.y;
  }
}

