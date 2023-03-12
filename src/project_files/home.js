import React from 'react';
import "./home.css";
import {Link} from 'react-router-dom'
import {useEffect, useState} from 'react'
import axios from 'axios';

function Home(){
    const [info, SetInfo] = useState([]);
    var arr;
    var [input, setInput] = useState();
    var [inputName, setInputName] = useState();
    var delName;
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
            LoadPage();
            document.getElementById(inputName).remove()
        }).catch((error) => {
            alert(error);
        });
    }
    function PollDelete(event){
        event.preventDefault();
        delName = event.target.id;
        const del = {
            pollName: delName
        };
        console.log(del);
        const link = 'http://localhost:3001/delete';
        axios.delete(link, { data: {del} }).then((res)=>{
            alert("Success");
            LoadPage();
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
                
                    <button id={arr[i].pollName} className = "PollSubmit" type = "Submit" onClick={PollSubmit} >Submit Vote</button>
                    <button id={arr[i].pollName} className = "PollDelete" type = "Submit" onClick={PollDelete} >Delete Poll</button>
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