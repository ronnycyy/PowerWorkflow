import { Editor } from "../../models/State";
import { EditorActionType, EDITOR_ACTION } from "../actions/editorAction";
import {fabric} from "fabric";

const initState: Editor = {
  canvas: null
}

function editorReducer(state = initState, action: EditorActionType): Editor {
  console.log(state, action);

  switch (action.type) {
    case EDITOR_ACTION.INIT_CANVAS: {
      return {
        ...state,
        canvas: action.payload as fabric.Canvas
      }
    }

    default:
      return state;
  }
}

export default editorReducer;
