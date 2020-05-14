import React from 'react';
// import {hydrate, render} from 'react-dom';
// import { render } from 'react-snapshot';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.css';
// import './index.css';
import App from './App';
import { render } from 'react-snapshot';
import * as serviceWorker from './serviceWorker';

const rootElement = document.getElementById("root");
// if (rootElement.hasChildNodes()) {
//   hydrate(<App />, rootElement);
// } else {
//   render(<App />, rootElement);
//}
render(<App />, rootElement);
// hydrate(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
