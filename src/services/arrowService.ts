import ARROW from "../models/Arrow";
import { fabric } from "fabric";

export const initArrow = (canvas, point: { x: number, y: number }) => {
  const x = point.x;
  const y = point.y;

  const p0 = { x, y };
  const p1 = { x: x + ARROW.LINE.WIDTH, y  };
  const p2 = { x: p1.x, y: y + ARROW.LINE.HEIGHT };
  const p3 = { x: p2.x + (ARROW.HEAD.WIDTH / 2 - ARROW.LINE.WIDTH / 2), y: p2.y };
  const p4 = { x: x + ARROW.LINE.WIDTH / 2, y: p3.y + ARROW.HEAD.HEIGHT };
  const p5 = { x: x - (ARROW.HEAD.WIDTH / 2 - ARROW.LINE.WIDTH / 2), y: p3.y };
  const p6 = { x, y: p5.y };

  const points2 = [p0, p1, p2, p3, p4, p5, p6];

  const arrow = new fabric.Polygon(points2, {
    fill: '#000',
    selectable: false,
    objectCaching: false
  });

  canvas.add(arrow);
  canvas.renderAll();

  return arrow;
}

export const adjustArrow = (p: fabric.Object & { arrowDown: fabric.Polygon, arrowUp: fabric.Polygon }) => {
  if (p.arrowDown) {
    const arrow = p.arrowDown;
    const p0 = arrow.points[0];
    const p1 = arrow.points[1];
    const x = p.oCoords.mb.x;
    const y = p.oCoords.mb.y;

    p0.x = x;
    p0.y = y;
    p1.x = x + ARROW.LINE.WIDTH;
    p1.y = y;
  }

  if (p.arrowUp) {
    const arrow = p.arrowUp;
    const p2 = arrow.points[2];
    const p3 = arrow.points[3];
    const p4 = arrow.points[4];
    const p5 = arrow.points[5];
    const p6 = arrow.points[6];
    const x = p.oCoords.mt.x;
    const y = p.oCoords.mt.y;

    // 箭头尖端点
    p4.x = x;
    p4.y = y;

    p2.x = p4.x + ARROW.LINE.WIDTH / 2;
    p2.y = p4.y - ARROW.HEAD.HEIGHT;

    p3.x = p4.x + ARROW.HEAD.WIDTH / 2;
    p3.y = p2.y;

    p5.x = p3.x - ARROW.HEAD.WIDTH;
    p5.y = p3.y;

    p6.x = p4.x - ARROW.LINE.WIDTH / 2;
    p6.y = p5.y;
  }
}

