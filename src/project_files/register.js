import React from 'react';
import "./register.css";
import {Link} from 'react-router-dom';
import {withRouter} from './withRouter';
import axios from 'axios';

class Register extends React.Component{
    
    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: ''
        };
    } 
    
    handleInputChnage= (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSubmit =(event) => {
        event.preventDefault();
        const url = 'http://localhost:3001/register';
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
    
    render(){
        return  (
            <React.Fragment>
                <form id ="Half1" action ="/register" method = "POST">
                    <h1>Register </h1>
                    <h3>Username</h3>
                    <input type = "text" onChange={this.handleInputChnage} name ="username" id="user" placeholder = "Username" />
                    <h3>Password</h3>
                    <input type = "password" onChange={this.handleInputChnage} id="pass" name ="password" placeholder = "Password"/>
                    <button id="signUp" type = "Submit" onClick={this.handleSubmit} >Sign Up!</button>
                    <Link to ="/" id="Home">Already Have An Account?</Link>
                </form>
                <div id ="Half2">
                    <h1>Welcome to PollsrUS</h1>
                    <h4>Where your vote matters, Sign Up Today</h4>
                </div>
            </React.Fragment>
    )
    
        }
}

export default withRouter(Register)