import { Canvas } from "fabric/fabric-impl";
import Editor from "../layouts/Editor/Editor";

export type Editor = {
  canvas: Canvas;
}

type State = {
  editor: Editor;
}

export default State;
