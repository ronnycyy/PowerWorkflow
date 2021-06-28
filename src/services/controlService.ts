import { fabric } from 'fabric';
import ARROW from "../models/Arrow";
import { adjustArrow, initArrow } from "./arrowService";
import { ADD_ICON_SVG, DELETE_ICON_SVG } from "../models/Icon";


const deleteHandler = (eventData, transform) => {
  const target = transform.target;
  const c = target.canvas;
  c.remove(target);
  c.requestRenderAll();

  return true;
}

const addHandler = (eventData, transform) => {
  const target = transform.target;
  const canvas = target.canvas;

  target.clone((cloned) => {
    cloned.top += target.height + ARROW.LENGTH  + ARROW.HEAD.HEIGHT;
    canvas.add(cloned);

    // 生成箭头
    const x = target.oCoords.mb.x;
    const y = target.oCoords.mb.y;
    const arrow = initArrow(canvas, { x, y });

    // 将箭头附加到两个对象上，方便箭头随对象调整位置
    target.arrowDown = arrow;
    cloned.arrowUp = arrow;
  });

  canvas.on('object:moving', (e) => {
    adjustArrow(e.target);
    canvas.renderAll();
  });

  return true;
}

const initControls = () => {
  const deleteImg = document.createElement('img');
  deleteImg.src = DELETE_ICON_SVG;

  const cloneImg = document.createElement('img');
  cloneImg.src = ADD_ICON_SVG;

  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = 'blue';
  fabric.Object.prototype.cornerStyle = 'circle';

  function renderIcon(icon) {
    return function render(ctx, left, top, styleOverride, fabricObject) {
      const size = this.sizeX;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(icon, -size / 2, -size / 2, size, size);
      ctx.restore();
    }
  }

  fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5, // right
    y: -0.5, // top
    offsetY: -16,
    offsetX: 16,
    cursorStyle: 'pointer',
    sizeX: 24,
    mouseUpHandler: deleteHandler,
    render: renderIcon(deleteImg),
  });

  fabric.Object.prototype.controls.addControl = new fabric.Control({
    x: 0, // center
    y: 0.5, // bottom
    offsetY: 25,
    offsetX: 20,
    cursorStyle: 'pointer',
    mouseUpHandler: addHandler,
    render: renderIcon(cloneImg),
    sizeX: 32
  });
}

export default initControls;
