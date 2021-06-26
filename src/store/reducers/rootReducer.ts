import { combineReducers } from "redux";
import editorReducer from "./editorReducer";

const reducer = combineReducers({
  editor: editorReducer
})

export default reducer;
