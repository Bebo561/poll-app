import React from 'react';
import "./home.css";
import {Link} from 'react-router-dom'
import {useEffect, useState} from 'react'
import * as ReactDOM from 'react-dom';
import axios from 'axios';

function Home(){
    const [info, SetInfo] = useState([]);
    var arr;
    var [arr2, setArr2] = useState([]);
    useEffect(() =>{
        
        const url = 'http://localhost:3001/home';
        axios.get(url).then((res) => {
            SetInfo(JSON.stringify(res.data.polls));
            
        }).catch((error) => {
            alert(error.response.data.message);
     })
    }, []);   
    
    function PollSubmit(){
        return 0;
    }

    if(info.length > 0){
        arr= JSON.parse(info)
        console.log(arr[0].pollName)

        const elements = (
            <form id = "PollHolder">
                <h3>{arr[0].pollName}</h3>
                <input type="radio" id="pollOption" name="pollOption" value="HTML"/>
                <label for="pollOption">{arr[0].Option1}</label><br></br>

                <input type="radio" id="pollOption" name="pollOption" value="HTML"/>
                <label for="pollOption">{arr[0].Option2}</label><br></br>

                <input type="radio" id="pollOption" name="pollOption" value="HTML"/>
                <label for="pollOption">{arr[0].Option3}</label><br></br>
                
                <button id="PollSubmit" type = "Submit" onClick={PollSubmit} >Submit Vote</button>
            </form>
          );
        //var h1 = React.createElement('h4', {id: "Hi"}, arr[0].pollName);
        
        ReactDOM.render(elements, document.getElementById('Homepage'));
        
    }
    return (
            <React.Fragment>
                <Link to="/CreateVote" id = "createVote">Create Poll</Link>
                <div id = "Homepage">
                   
                </div>
            </React.Fragment>
        )
}

export default Home