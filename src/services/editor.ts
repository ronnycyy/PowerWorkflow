import { fabric } from "fabric";
import { CANVAS_BACKGROUND_COLOR, CANVAS_ID, HEADER_ID, SIDEBAR_ID } from "../configs/default";

export function generateCanvasService() {
  const canvas = new fabric.Canvas(CANVAS_ID, getResponsiveSizeOfWindow());
  canvas.setBackgroundColor(CANVAS_BACKGROUND_COLOR, () => null);
  initGrid(canvas);  // 绘制网格线
  canvas.renderAll();
  return canvas;
}

function getResponsiveSizeOfWindow() {
  const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  const height = (window.innerHeight > 0) ? window.innerHeight : screen.height;

  const sideRef = document.getElementById(SIDEBAR_ID);
  const sideWidth = sideRef ? sideRef.clientWidth : 0;

  const headerRef = document.getElementById(HEADER_ID);
  const headerHeight = headerRef ? headerRef.clientHeight : 0;

  return { width: width - sideWidth, height: height - headerHeight }
}


function initGrid(canvas: fabric.Canvas) {
  const grid = 30;
  const width = 5000;
  const borderColor = '#cccccc';
  const gridLength = width / grid;
  const lineOptions = {
    stroke: '#ebebeb',
    selectable: false,
    evented: false,
    id: 'grid',
  };

  for (let i = 0; i < gridLength; i++) {
    const distance = i * grid;
    const fhorizontal = new fabric.Line([distance, -width, distance, width], lineOptions);
    const shorizontal = new fabric.Line([distance - width, -width, distance - width, width], lineOptions);
    canvas.add(fhorizontal);
    canvas.add(shorizontal);
    const fvertical = new fabric.Line([-width, distance - width, width, distance - width], lineOptions);
    const svertical = new fabric.Line([-width, distance, width, distance], lineOptions);
    canvas.add(fvertical);
    canvas.add(svertical);
    if (i % 5 === 0) {
      fhorizontal.set({ stroke: borderColor });
      shorizontal.set({ stroke: borderColor });
      fvertical.set({ stroke: borderColor });
      svertical.set({ stroke: borderColor });
    }
  }
}