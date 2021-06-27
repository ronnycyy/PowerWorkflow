import Editor from "../layouts/Editor/Editor";
import { fabric } from "fabric";

export type Editor = {
  canvas: fabric.Canvas;
}

type State = {
  editor: Editor;
}

export default State;
