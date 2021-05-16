import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import 'antd/dist/antd.css'

import 'antd-mobile/dist/antd-mobile.css' //引入antd-mobible

import { HashRouter as Router } from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
