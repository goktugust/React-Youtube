import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './Home';
import 'semantic-ui-css/semantic.min.css'
import Video from './Video';



const router = 
  <Router>
    <Route path="/" exact component={Home}></Route>
    <Route path="/video/:id" component={Video}></Route>
  </Router>


ReactDOM.render(
  router,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
