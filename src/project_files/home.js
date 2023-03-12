import React from 'react';
import "./home.css";
import {Link} from 'react-router-dom'
import {useEffect, useState} from 'react'
import * as ReactDOM from 'react-dom';
import axios from 'axios';

function Home(){
    const [info, SetInfo] = useState([]);
    var arr;
    var [input, setInput] = useState();
    var [inputName, setInputName] = useState();
    function LoadPage(){
        const url = 'http://localhost:3001/home';
        axios.get(url).then((res) => {
            SetInfo(JSON.stringify(res.data.polls));
            
        }).catch((error) => {
            alert(error.response.data.message);
     })
    }
    useEffect(() =>{
    LoadPage();
    }, []);   
    
    function PollSubmit(event){
        event.preventDefault();
        
        const link = 'http://localhost:3001/poll';
        const data = {
            pollName: inputName,
            option: input
        };
        console.log(data);
        axios.put(link, data).then((res)=>{
            console.log(res);
            LoadPage()
            document.getElementById('PollSubmit').remove()
        }).catch((error) => {
            alert(error);
        });
    }

    if(info.length > 0){
        const HandlePollInput = (event) => {
            event.persist();
            setInput(event.target.id);
            setInputName(event.target.value);      
        }

        arr= JSON.parse(info)
        var indents = [];
        for(var i = 0; i < arr.length; i++){   
            const elements = (
                <form id = "PollHolder">
                    <h3>{arr[i].pollName}</h3>
                    <input type="radio" id="Option1" onChange={HandlePollInput} name="pollOption" value={arr[i].pollName}/>
                    <label for="Option1">{arr[i].Option1} - {arr[i].numOfVotes1}</label><br></br>

                    <input type="radio" id="Option2" name="pollOption" onChange={HandlePollInput} value={arr[i].pollName}/>
                    <label for="Option2">{arr[i].Option2} - {arr[i].numOfVotes2}</label><br></br>

                    <input type="radio" id="Option3" name="pollOption" onChange={HandlePollInput} value={arr[i].pollName}/>
                    <label for="Option3">{arr[i].Option3} - {arr[i].numOfVotes3}</label><br></br>
                
                    <button id="PollSubmit" type = "Submit" name = {arr[i].pollName} onClick={PollSubmit} >Submit Vote</button>
                </form>
            );
            indents.push(elements);
        }
        return (
            <React.Fragment>
                <Link to="/CreateVote" id = "createVote">Create Poll</Link>
                <div id = "Homepage">
                   {indents}
                </div>
            </React.Fragment>
        ) 
    }
}

export default Home