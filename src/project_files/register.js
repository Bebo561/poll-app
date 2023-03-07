import React from 'react';
import "./register.css";

const Register = () => {
    return  (
        <React.Fragment>
       <div id ="Half1">
        <h1>Register Here</h1>
        <h3>Username</h3>
        <input type = "text" id="user" placeholder = "Username" />
        <h3>Password</h3>
        <input type = "password" id="pass" placeholder = "Password"/>
        <button id="signUp">Sign Up!</button>
       </div>
       <div id ="Half2">
            <h1>Welcome to PollsrUS</h1>
            <h4>Where your vote matters, Sign Up Today</h4>
       </div>
       </React.Fragment>
    )
}

export default Register