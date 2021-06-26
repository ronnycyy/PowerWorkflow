import * as React from "react";
import * as ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import App from './container/App';
import store from "./store";


// React18 并发模式
const el = document.getElementById("root");
ReactDOM.createRoot(el).render(
  <Provider store={store}>
    <App />
  </Provider>
);

// 同步模式
// ReactDOM.render(<App />, el);
