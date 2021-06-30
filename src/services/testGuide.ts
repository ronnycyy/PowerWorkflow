import { fabric } from "fabric";
// import "./fabric-smart-object.js";


export const testGuid = (canvas: fabric.Canvas) => {

// ADD YOUR CODE HERE
  const events = {
    object: ["added", "moving", "moved", "scaled", "selected", "over"],
    mouse: ["down", "up", "moving", "over", "out"]
  };

  function bindEvents() {
    events.object.forEach(event => {
      if (event === "added") {
        canvas.on(`object:${event}`, onObjectAdded);
      } else if (event === "moving") {
        canvas.on(`object:${event}`, onObjectMoving);
      } else if (event === "moved") {
        canvas.on(`object:${event}`, onObjectMoved);
      }
    });
  }

  function createRect(left, top, color) {
    const options = {
      originX: "left",
      originY: "top",
      left,
      top,
      width: 100,
      height: 100,
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 5,
    };

    if (color) {
      options.fill = color;
    }

    const rect = new fabric.Rect(options);

    // @ts-ignore
    rect.guides = {};

    canvas.add(rect);
    canvas.renderAll();
  }

  function init() {
    bindEvents();
    createRect(200, 200, '#fff');
    createRect(
      Math.floor(Math.random() * canvas.width),
      Math.floor(Math.random() * canvas.height),
      "#fff"
    );
  }

  function onObjectAdded(e) {
    // Add the smart guides around the object
    const obj = e.target;

    if (!(obj instanceof fabric.Rect)) return false;

    drawObjectGuides(obj);
  }

  function onObjectMoved(e) {
    // Add the smart guides around the object
    const obj = e.target;
    if (!(obj instanceof fabric.Rect)) return false;
    drawObjectGuides(obj);
  }

  function onObjectMoving(e) {
    const obj: any = e.target;

    // if (!(obj instanceof fabric.Rect)) return false;

    drawObjectGuides(obj);

      // Loop through each object in canvas

    const objects: any[] = canvas
        .getObjects()
        .filter(o => o.type !== "line" && o !== obj);
    // var {bl,br,tl,tr} = obj.oCoords
    const matches = new Set();

    for (const i of objects) {
      // i.set('opacity', obj.intersectsWithObject(i) ? 0.5 : 1);

      // tslint:disable-next-line:forin
      // @ts-ignore
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
          snapObject(obj, axis, newPos);
        }

        if (side === "left") {
          if (inRange(obj.guides.left[axis], i.guides.right[axis])) {
            matches.add(side);
            snapObject(obj, axis, i.guides.right[axis]);
          }
        } else if (side === "right") {
          if (inRange(obj.guides.right[axis], i.guides.left[axis])) {
            matches.add(side);
            snapObject(obj, axis, i.guides.left[axis] - obj.getScaledWidth());
          }
        } else if (side === "top") {
          if (inRange(obj.guides.top[axis], i.guides.bottom[axis])) {
            matches.add(side);
            snapObject(obj, axis, i.guides.bottom[axis]);
          }
        } else if (side === "bottom") {
          if (inRange(obj.guides.bottom[axis], i.guides.top[axis])) {
            matches.add(side);
            snapObject(obj, axis, i.guides.top[axis] - obj.getScaledHeight());
          }
        } else if (side === "centerX") {
          if (inRange(obj.guides.centerX[axis], i.guides.left[axis])) {
            matches.add(side);
            snapObject(
              obj,
              axis,
              i.guides.left[axis] - obj.getScaledWidth() / 2
            );
          } else if (
            inRange(obj.guides.centerX[axis], i.guides.right[axis])
          ) {
            matches.add(side);
            snapObject(
              obj,
              axis,
              i.guides.right[axis] - obj.getScaledWidth() / 2
            );
          }
        } else if (side === "centerY") {
          if (inRange(obj.guides.centerY[axis], i.guides.top[axis])) {
            matches.add(side);
            snapObject(
              obj,
              axis,
              i.guides.top[axis] - obj.getScaledHeight() / 2
            );
          } else if (
            inRange(obj.guides.centerY[axis], i.guides.bottom[axis])
          ) {
            matches.add(side);
            snapObject(
              obj,
              axis,
              i.guides.bottom[axis] - obj.getScaledHeight() / 2
            );
          }
        }
      }

      /*   if(inRange(obj.left, i.left)){
          console.log('left')
          matches.left = true
          snapObject(obj, 'left', i.left)
        }

        if(inRange(obj.top, i.top)){
          console.log('top')
          matches.top = true
          snapObject(obj, 'top', i.top)
        } */
    }

    // @ts-ignore
    for (const k of matches) {
      obj.guides[k].set("opacity", 1);
    }

    obj.setCoords();
  }

// If the 2 different coordinates are in range
  function inRange(a, b) {
    return Math.abs(a - b) <= 10;
  }

  function snapObject(obj, side, pos) {
    obj.set(side, pos);
    obj.setCoords();
    drawObjectGuides(obj);
  }

  /* function onObjectMouseOver(e){
      var obj = e.target
      if(!(obj instanceof fabric.Line)) return false
      obj.set('opacity', 1)
      canvas.renderAll()
  } */

  function drawObjectGuides(obj) {
    const w = obj.getScaledWidth();
    const h = obj.getScaledHeight();
    drawGuide("top", obj.top, obj);
    drawGuide("left", obj.left, obj);
    drawGuide("centerX", obj.left + w / 2, obj);
    drawGuide("centerY", obj.top + h / 2, obj);
    drawGuide("right", obj.left + w, obj);
    drawGuide("bottom", obj.top + h, obj);
    obj.setCoords();
  }

  function drawGuide(side, pos, obj) {
    let ln;
    const color = "rgb(178, 207, 255)";
    const lineProps = {
      left: 0,
      top: 0,
      evented: true,
      stroke: color,
      selectable: false,
      opacity: 0,
      strokeWidth: 5
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

    if (obj.guides[side] instanceof fabric.Line) {
      // remove the line
      canvas.remove(obj.guides[side]);
      delete obj.guides[side];
    }
    obj.guides[side] = ln;
    canvas.add(ln).renderAll();
  }

  init();

}