import {fabric} from "fabric";

// 绘制引导线
export function drawObjectGuides(obj: fabric.Object, canvas: fabric.Canvas) {
  const w = obj.getScaledWidth();
  const h = obj.getScaledHeight();
  drawGuide("top", obj.top, obj, canvas);
  drawGuide("left", obj.left, obj, canvas);
  drawGuide("centerX", obj.left + w / 2, obj, canvas);
  drawGuide("centerY", obj.top + h / 2, obj, canvas);
  drawGuide("right", obj.left + w, obj, canvas);
  drawGuide("bottom", obj.top + h, obj, canvas);
  obj.setCoords();
}

function drawGuide(side, pos, obj, canvas) {
  let ln;
  const color = "rgb(178, 207, 255)";
  const lineProps = {
    left: 0,
    top: 0,
    evented: true,
    stroke: color,
    selectable: false,
    opacity: 0
  };
  switch (side) {
    case "top":
      ln = new fabric.Line(
        [0, 0, canvas.width, 0],
        {...lineProps, 
          left: 0,
          top: pos}
      );
      break;
    case "bottom":
      ln = new fabric.Line(
        [0, 0, canvas.width, 0],
        {...lineProps, 
          left: 0,
          top: pos}
      );
      break;

    case "centerY":
      ln = new fabric.Line(
        [0, 0, canvas.width, 0],
        {...lineProps, 
          left: 0,
          top: pos}
      );
      break;

    case "left":
      ln = new fabric.Line(
        [0, canvas.height, 0, 0],
        {...lineProps, 
          left: pos,
          top: 0}
      );
      break;
    case "right":
      ln = new fabric.Line(
        [0, canvas.height, 0, 0],
        {...lineProps, 
          left: pos,
          top: 0}
      );
      break;
    case "centerX":
      ln = new fabric.Line(
        [0, canvas.height, 0, 0],
        {...lineProps, 
          left: pos,
          top: 0}
      );
      break;
  }

  if (!obj.guides) {
    obj.guides = {};
  }

  if (obj.guides[side] instanceof fabric.Line) {
    // remove the line
    canvas.remove(obj.guides[side]);
    delete obj.guides[side];
  }


  obj.guides[side] = ln;
  canvas.add(ln).renderAll();
}

export function onObjectMoving(e, canvas) {
  const obj = e.target;

  // if (!(obj instanceof fabric.Rect)) return false;

  drawObjectGuides(obj, canvas);

  const objects = canvas
      .getObjects()
      .filter(o => o.type !== "line" && o !== obj && o.guides);
  // var {bl,br,tl,tr} = obj.oCoords
  const matches = new Set();

  for (const i of objects) {
    // tslint:disable-next-line:forin
    for (const side in obj.guides) {
      // tslint:disable-next-line:one-variable-per-declaration
      let axis, newPos;

      switch (side) {
        case "right":
          axis = "left";
          newPos = i.guides[side][axis] - obj.getScaledWidth();
          break;
        case "bottom":
          axis = "top";
          newPos = i.guides[side][axis] - obj.getScaledHeight();
          break;
        case "centerX":
          axis = "left";
          newPos = i.guides[side][axis] - obj.getScaledWidth() / 2;
          break;
        case "centerY":
          axis = "top";
          newPos = i.guides[side][axis] - obj.getScaledHeight() / 2;
          break;
        default:
          axis = side;
          newPos = i.guides[side][axis];
          break;
      }

      if (inRange(obj.guides[side][axis], i.guides[side][axis])) {
        matches.add(side);
        snapObject(obj, axis, newPos, canvas);
      }

      if (side === "left") {
        if (inRange(obj.guides.left[axis], i.guides.right[axis])) {
          matches.add(side);
          snapObject(obj, axis, i.guides.right[axis], canvas);
        }
      } else if (side === "right") {
        if (inRange(obj.guides.right[axis], i.guides.left[axis])) {
          matches.add(side);
          snapObject(obj, axis, i.guides.left[axis] - obj.getScaledWidth(), canvas);
        }
      } else if (side === "top") {
        if (inRange(obj.guides.top[axis], i.guides.bottom[axis])) {
          matches.add(side);
          snapObject(obj, axis, i.guides.bottom[axis], canvas);
        }
      } else if (side === "bottom") {
        if (inRange(obj.guides.bottom[axis], i.guides.top[axis])) {
          matches.add(side);
          snapObject(obj, axis, i.guides.top[axis] - obj.getScaledHeight(), canvas);
        }
      } else if (side === "centerX") {
        if (inRange(obj.guides.centerX[axis], i.guides.left[axis])) {
          matches.add(side);
          snapObject(
            obj,
            axis,
            i.guides.left[axis] - obj.getScaledWidth() / 2, canvas
          );
        } else if (
          inRange(obj.guides.centerX[axis], i.guides.right[axis])
        ) {
          matches.add(side);
          snapObject(
            obj,
            axis,
            i.guides.right[axis] - obj.getScaledWidth() / 2, canvas
          );
        }
      } else if (side === "centerY") {
        if (inRange(obj.guides.centerY[axis], i.guides.top[axis])) {
          matches.add(side);
          snapObject(
            obj,
            axis,
            i.guides.top[axis] - obj.getScaledHeight() / 2, canvas
          );
        } else if (
          inRange(obj.guides.centerY[axis], i.guides.bottom[axis])
        ) {
          matches.add(side);
          snapObject(
            obj,
            axis,
            i.guides.bottom[axis] - obj.getScaledHeight() / 2, canvas
          );
        }
      }
    }
  }

  // @ts-ignore
  for (const k of matches) {
    obj.guides[k].set("opacity", 1);
  }

  obj.setCoords();
}

function inRange(a, b) {
  return Math.abs(a - b) <= 10;
}

function snapObject(obj, side, pos, canvas) {
  obj.set(side, pos);
  obj.setCoords();
  drawObjectGuides(obj, canvas);
}
