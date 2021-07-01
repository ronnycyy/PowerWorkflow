import { fabric } from 'fabric';
import ARROW from "../models/Arrow";
import { adjustArrow, initArrow } from "./arrowService";
import { ADD_ICON_SVG, DELETE_ICON_SVG } from "../models/Icon";
import {onObjectMoving} from "./guideLineService";


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



//
//
// function onObjectMoving(e, canvas) {
//   console.log('onObjectMoving',e)
//   const obj = e.target;
//
//   // if (!(obj instanceof fabric.Rect)) return false;
//
//   drawObjectGuides(obj, canvas);
//
//   // Loop through each object in canvas
//
//   const objects: any[] = canvas
//     .getObjects()
//     .filter(o => o.type !== "line" && o !== obj && o.guides);
//
//   // var {bl,br,tl,tr} = obj.oCoords
//   const matches = new Set();
//
//   for (const i of objects) {
//     // i.set('opacity', obj.intersectsWithObject(i) ? 0.5 : 1);
//
//     // tslint:disable-next-line:forin
//     // @ts-ignore
//     // tslint:disable-next-line:forin
//     for (const side in obj.guides) {
//       // tslint:disable-next-line:one-variable-per-declaration
//       let axis, newPos;
//
//       switch (side) {
//         case "right":
//           axis = "left";
//           newPos = i.guides[side][axis] - obj.getScaledWidth();
//           break;
//         case "bottom":
//           axis = "top";
//           newPos = i.guides[side][axis] - obj.getScaledHeight();
//           break;
//         case "centerX":
//           axis = "left";
//           newPos = i.guides[side][axis] - obj.getScaledWidth() / 2;
//           break;
//         case "centerY":
//           axis = "top";
//           newPos = i.guides[side][axis] - obj.getScaledHeight() / 2;
//           break;
//         default:
//           axis = side;
//           newPos = i.guides[side][axis];
//           break;
//       }
//
//       if (inRange(obj.guides[side][axis], i.guides[side][axis])) {
//         matches.add(side);
//         snapObject(obj, axis, newPos, canvas);
//       }
//
//       if (side === "left") {
//         if (inRange(obj.guides.left[axis], i.guides.right[axis])) {
//           matches.add(side);
//           snapObject(obj, axis, i.guides.right[axis], canvas);
//         }
//       } else if (side === "right") {
//         if (inRange(obj.guides.right[axis], i.guides.left[axis])) {
//           matches.add(side);
//           snapObject(obj, axis, i.guides.left[axis] - obj.getScaledWidth(), canvas);
//         }
//       } else if (side === "top") {
//         if (inRange(obj.guides.top[axis], i.guides.bottom[axis])) {
//           matches.add(side);
//           snapObject(obj, axis, i.guides.bottom[axis], canvas);
//         }
//       } else if (side === "bottom") {
//         if (inRange(obj.guides.bottom[axis], i.guides.top[axis])) {
//           matches.add(side);
//           snapObject(obj, axis, i.guides.top[axis] - obj.getScaledHeight(),canvas);
//         }
//       } else if (side === "centerX") {
//         if (inRange(obj.guides.centerX[axis], i.guides.left[axis])) {
//           matches.add(side);
//           snapObject(
//             obj,
//             axis,
//             i.guides.left[axis] - obj.getScaledWidth() / 2,
//             canvas
//           );
//         } else if (
//           inRange(obj.guides.centerX[axis], i.guides.right[axis])
//         ) {
//           matches.add(side);
//           snapObject(
//             obj,
//             axis,
//             i.guides.right[axis] - obj.getScaledWidth() / 2,
//             canvas
//           );
//         }
//       } else if (side === "centerY") {
//         if (inRange(obj.guides.centerY[axis], i.guides.top[axis])) {
//           matches.add(side);
//           snapObject(
//             obj,
//             axis,
//             i.guides.top[axis] - obj.getScaledHeight() / 2,
//             canvas
//           );
//         } else if (
//           inRange(obj.guides.centerY[axis], i.guides.bottom[axis])
//         ) {
//           matches.add(side);
//           snapObject(
//             obj,
//             axis,
//             i.guides.bottom[axis] - obj.getScaledHeight() / 2,
//             canvas
//           );
//         }
//       }
//     }
//
//     /*   if(inRange(obj.left, i.left)){
//         console.log('left')
//         matches.left = true
//         snapObject(obj, 'left', i.left)
//       }
//
//       if(inRange(obj.top, i.top)){
//         console.log('top')
//         matches.top = true
//         snapObject(obj, 'top', i.top)
//       } */
//   }
//
//   // @ts-ignore
//   for (const k of matches) {
//     obj.guides[k].set("opacity", 1);
//   }
//
//   obj.setCoords();
// }
//
// function inRange(a, b) {
//   return Math.abs(a - b) <= 10;
// }
//
//
// export function drawObjectGuides(obj, canvas) {
//   const w = obj.getScaledWidth();
//   const h = obj.getScaledHeight();
//   drawGuide("top", obj.top, obj, canvas);
//   drawGuide("left", obj.left, obj, canvas);
//   drawGuide("centerX", obj.left + w / 2, obj, canvas);
//   drawGuide("centerY", obj.top + h / 2, obj, canvas);
//   drawGuide("right", obj.left + w, obj, canvas);
//   drawGuide("bottom", obj.top + h, obj, canvas);
//   obj.setCoords();
// }
//
// function snapObject(obj, side, pos, canvas) {
//   obj.set(side, pos);
//   obj.setCoords();
//   drawObjectGuides(obj, canvas);
// }
//
// function drawGuide(side, pos, obj, canvas) {
//   if (!obj.guides) {obj.guides = {}}
//
//   let ln;
//   const color = "rgb(178, 207, 255)";
//   const lineProps = {
//     left: 0,
//     top: 0,
//     evented: true,
//     stroke: color,
//     selectable: false,
//     opacity: 0,
//     strokeWidth: 5
//   };
//   switch (side) {
//     case "top":
//       ln = new fabric.Line(
//         [0, 0, canvas.width, 0],
//         {...lineProps,
//           left: 0,
//           top: pos}
//       );
//       break;
//     case "bottom":
//       ln = new fabric.Line(
//         [0, 0, canvas.width, 0],
//         {...lineProps,
//           left: 0,
//           top: pos}
//       );
//       break;
//
//     case "centerY":
//       ln = new fabric.Line(
//         [0, 0, canvas.width, 0],
//         {...lineProps,
//           left: 0,
//           top: pos}
//       );
//       break;
//
//     case "left":
//       ln = new fabric.Line(
//         [0, canvas.height, 0, 0],
//         {...lineProps,
//           left: pos,
//           top: 0}
//       );
//       break;
//     case "right":
//       ln = new fabric.Line(
//         [0, canvas.height, 0, 0],
//         {...lineProps,
//           left: pos,
//           top: 0}
//       );
//       break;
//     case "centerX":
//       ln = new fabric.Line(
//         [0, canvas.height, 0, 0],
//         {...lineProps,
//           left: pos,
//           top: 0}
//       );
//       break;
//   }
//
//   if (obj.guides && obj.guides[side] instanceof fabric.Line) {
//     // remove the line
//     canvas.remove(obj.guides[side]);
//     delete obj.guides[side];
//   }
//   obj.guides[side] = ln;
//   canvas.add(ln).renderAll();
// }
//





export default initControls;
