import React from 'react';
import "./login.css";
import {Link} from 'react-router-dom';
import {withRouter} from './withRouter';
import axios from 'axios';

class Login extends React.Component{
    
    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: ''
        };
    } 
    handleInputSwitch= (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSub=(event) => {
        event.preventDefault();
        const url = 'http://localhost:3001/';
        const acc = {
            username: this.state.Username,
            password: this.state.Password
        };
        localStorage.setItem("username", this.state.Username);
        console.log(localStorage.getItem("username"));
        axios.post(url, acc).then((res) => {
            alert("Successful Submission!");
            console.log(res)
            this.props.navigate('/home');
        }).catch((error) => {
            alert(error.response.data.message);
            console.log(error.response.data.message)
        })
    }

    render(){
        return (
            <React.Fragment>
                <form id = "Form" method="POST" action = "/login"> 
                    <h1>Login Form</h1>
                    <input type = "text" id = "Log" name="Username" onChange={this.handleInputSwitch} placeholder = "Username" />
                    <input type = "password" id = "Log" name ="Password" onChange={this.handleInputSwitch} placeholder = "Password"/>

                    <button id="signIn" onClick={this.handleSub}>Sign In</button>
                    <Link to ="/register" id="Reg">Don't Have An Account?</Link>
                </form>
             </React.Fragment>
    )
    }
}

export default withRouter(Login)