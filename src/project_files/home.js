import React from 'react';
import "./home.css";
import {withRouter} from './withRouter';

class Home extends React.Component {
    handleCreation = (event) =>{
        this.props.navigate("/CreateVote")
    }
    render() {
        return (
            <React.Fragment>
                <button id = "createVote" onClick={this.handleCreation} type = "submit">Create Poll</button>
                <div id = "Homepage">
                    <h1>Hello World!</h1>   
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Home)