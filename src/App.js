import Login from './project_files/login.js';
import './App.css';
import Register from './project_files/register.js'
import Home from './project_files/home.js'
import {Routes, Route} from "react-router-dom";
import React from 'react';
function App() {
  return (
    <React.Fragment>
    <div id = "Header">
    <p id="site">PollsrUs</p>
    </div>
    <Routes>
      <Route path = "/" element={<Login />}/>
      <Route path = "/register" element={<Register />}/>
      <Route path = "/home" element={<Home />}/>
    </Routes>

    </React.Fragment>
   
  );
}

export default App;
