import * as React from "react";
import * as ReactDOM from 'react-dom';
import App from './container/App';

// 并发模式
const el = document.getElementById("root");
ReactDOM.createRoot(el).render(<App/>);

// 同步模式
// ReactDOM.render(<App />, document.getElementById("root"));
