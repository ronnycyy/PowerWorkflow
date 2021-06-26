import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CANVAS_ID } from "../configs/default";
import { editorAction } from '../store/actions/editorAction';

const Canvas = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(editorAction.createInitCanvasAction());  // 组件的DOM挂载完毕时，初始化画布。该操作只执行一次，组件重新渲染也不会再执行。
  }, []);

  return (
    <canvas id={CANVAS_ID} />
  )
}

export default Canvas;
