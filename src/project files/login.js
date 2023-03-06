import React from 'react';
import "./login.css";

const loginPage = () => {
    return (

        <div id = "Form">
            <h1>Login Form</h1>
            <input type = "text" placeholder = "Username" />
            <input type = "password" placeholder = "Password"/>

            <button id="signIn">Sign In</button>

            <span className = "Reg">
                <a href ="#">Don't Have An Account?</a>
            </span>
        </div>
    )
}

export default loginPage