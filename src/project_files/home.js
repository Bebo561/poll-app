import React from 'react';
import "./home.css";
import {Link} from 'react-router-dom'
import {useEffect} from 'react'
import axios from 'axios';


function Home(){
    useEffect(() =>{
        const url = 'http://localhost:3001/home';
        axios.get(url).then((res) => {
            console.log(res);
            alert("Successful Submission!");
        }).catch((error) => {
            alert(error.response.data.message);
        })
    });

        return (
            <React.Fragment>
                <Link to="/CreateVote" id = "createVote">Create Poll</Link>
                <div id = "Homepage">
                    <h1>Hello World!</h1>   
                </div>
            </React.Fragment>
        )
}

export default Home