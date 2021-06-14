import * as React from 'react';
import { useInitCanvas } from "../hooks/useInitCanvas";
import { CANVAS_ID } from "../configs/default";

const Canvas = () => {
  useInitCanvas();

  return (
    <canvas id={CANVAS_ID} />
  )
}

export default Canvas;
