import React from 'react';
import "./login.css";
import { Link} from 'react-router-dom';
import axios from 'axios';

class Login extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: ''
        };
    } 
    handleSub = (event) =>{
        event.preventDefault();
        const url = 'http://localhost:3001/login';
        const user = {
            username: this.state.username,
            password: this.state.password
        };
        console.log(user);
        axios.post(url, user).then((res) => {
            console.log(res);
            alert("Successful Submission!");
            this.props.navigate('/')
        }).catch((error) => {
            alert(error.message);
        })
    }
    handleInputChnage= (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    render(){
        return (
            <React.Fragment>
                <form id = "Form" method="POST" action = "/login"> 
                    <h1>Login Form</h1>
                    <input type = "text" id = "Log" name ="username" onChange={this.handleInputChnage} placeholder = "Username" />
                    <input type = "password" id = "Log" name ="password" onChange={this.handleInputChnage} placeholder = "Password"/>

                    <button id="signIn" onClick={this.handleSub}>Sign In</button>
                    <Link to ="/register" id="Reg">Don't Have An Account?</Link>
                </form>
             </React.Fragment>
    )
    }
}

export default Login