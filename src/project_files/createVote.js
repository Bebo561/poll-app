import React from "react"
import './createVote.css'
import {Link} from 'react-router-dom';
import {withRouter} from './withRouter';
import axios from 'axios';

var uname;

class CreateVote extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pollName: '',
            Option1: '',
            numOfVotes1: '',
            Option2: '',
            numOfVotes2: '',
            Option3: '',
            numOfVotes3: ''
        };
    } 
    handlePollInput= (e) => {
        uname = localStorage.getItem("username");
        console.log(uname)
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleCreatePoll = (event) =>{
        event.preventDefault();
        const url = 'http://localhost:3001/createVote';
        console.log(uname)
        const poll = {
            pollName: this.state.pollName,
            Option1: this.state.Option1,
            numOfVotes1: 0,
            Option2: this.state.Option2,
            numOfVotes2: 0,
            Option3: this.state.Option3,
            numOfVotes3: 0,
            users: [],
            admin: uname
        };
        console.log(poll);
        axios.post(url, poll).then((res)=>{
            alert("Poll Successfully Created!");
            this.props.navigate('/home');
        }).catch((error) => {
            alert(error.response.data.message)
        });
    }
    render() {
    return(
        <React.Fragment>
            <Link to ="/home" id="return">Return To Homepage</Link>
            <form id ="pollCreation" method="POST" action="/createVote">
                <h2 id ="ph1">Poll Name</h2>
                <input type = "text" id = "pollName" name="pollName" onChange={this.handlePollInput} placeholder = "Poll Name" />
                <h3 id ="ph">Poll Option 1</h3>
                <input type = "text" id = "Option" name="Option1" onChange={this.handlePollInput} placeholder = "Option 1" />
                <h3 id ="ph">Poll Option 2</h3>
                <input type = "text" id = "Option" name="Option2" onChange={this.handlePollInput} placeholder = "Option 2" />
                <h3 id ="ph">Poll Option 3</h3>
                <input type = "text" id = "Option" name="Option3" onChange={this.handlePollInput} placeholder = "Option 3" />
                <button id="createPoll" onClick={this.handleCreatePoll}>Create Poll</button>
            </form>
        </React.Fragment>
        )
    }
}

export default withRouter(CreateVote)