import React from 'react';
import "./login.css";
import { Link} from 'react-router-dom';
import Register from './register'

const Login = () => {
    return (

        <div id = "Form">
            <h1>Login Form</h1>
            <input type = "text" id = "Log"placeholder = "Username" />
            <input type = "password" id = "Log"placeholder = "Password"/>

            <button id="signIn">Sign In</button>
            <Link to ="/register" id="Reg">Don't Have An Account?</Link>
                
        </div>
    )
}

export default Login