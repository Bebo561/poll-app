import React from 'react';
import "./register.css";

const Register = () => {
    return  (
        <React.Fragment>
       <div id ="Half1">
        <h1>Register Here</h1>
        <input type = "text" id="user" placeholder = "Username" />
        <input type = "password" id="pass" placeholder = "Password"/>
        <button id="signUp">Sign Up!</button>
       </div>
       <div id ="Half2">
        
       </div>
       </React.Fragment>
    )
}

export default Register