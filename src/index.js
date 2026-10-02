import React from 'react';
import ReactDOM from 'react-dom';
import './style/global.style.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

if (typeof window !== 'undefined' && !window.process) {
  window.process = { env: { NODE_ENV: process.env.NODE_ENV || 'development', PUBLIC_URL: process.env.PUBLIC_URL || '' } };
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
