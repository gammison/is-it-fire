// get css files
require('../css/main.css');

import React from 'react';
import ReactDom from 'react-dom';
import HomePage from './pages/homePage.jsx';

const mountNode = document.getElementById("mount-point");

ReactDom.render(
  <HomePage app_props = { window.APP_PROPS }/>,
  mountNode
);