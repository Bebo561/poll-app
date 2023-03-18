import React from 'react';
import "./home.css";
import {Link} from 'react-router-dom'
import {useEffect, useState} from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem,} from 'reactstrap'
function Home(){
    const [info, SetInfo] = useState([]);
    var arr;
    var [input, setInput] = useState();
    var [inputName, setInputName] = useState();
    var delName;
    var uname = localStorage.getItem("username");
    function LoadPage(){
        const url = 'http://localhost:3001/home';
        axios.get(url).then((res) => {
            SetInfo(JSON.stringify(res.data));
            console.log(info.length)
        }).catch((error) => {
            alert(error.response.data.message);
     })
    }
    useEffect(() =>{
    LoadPage();
    }, []); 

    const [dropdownOpen, setDropdownOpen] = useState(false);
    function toggle(){
        setDropdownOpen((prevState) => !prevState);
    }
    function Logout(event){
        event.preventDefault();
        localStorage.removeItem("username");
    }
    function PollSubmit(event){
        event.preventDefault();
        
        const link = 'http://localhost:3001/poll';
        const data = {
            pollName: inputName,
            option: input,
            users: uname
        };
        console.log(data);

        axios.put(link, data).then((res)=>{
            console.log(res);
            LoadPage();
            document.getElementById(inputName).remove()
        }).catch((error) => {
            alert(error.response.data.message)
        });
    }
    function PollDelete(event){
        event.preventDefault();
        console.log(uname)
        delName = event.target.id;
        const del = {
            pollName: delName,
            admin: uname
        };
        console.log(del);
        const link = 'http://localhost:3001/delete';
        axios.delete(link, { data: {del} }).then((res)=>{
            alert("Success");
            LoadPage();
        }).catch((error) => {
            alert(error.response.data.message);
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
            var elements = (
                <form id = "PollHolder">
                    <h3>{arr[i].pollName}</h3>
                    <h6>Created by: {arr[i].Admin}</h6>
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
       if(arr.length > 0){
        return (
            <React.Fragment>
                <Link to="/CreateVote" id = "createVote">Create Poll</Link>
                <div id = "Homepage">
                    {indents}
                </div>
                    <Dropdown isOpen={dropdownOpen} toggle={toggle} id="drop">
                        <DropdownToggle caret size="lg" color= 'primary'>
                         {uname}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem><Link to="/" onClikc={Logout}>Logout</Link></DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
            </React.Fragment>  
        ) 
       }
        if(arr.length === 0){
    
            return (
                <React.Fragment>
                    <Link to="/CreateVote" id = "createVote" color= 'primary'>Create Poll</Link>
                    <div id = "Homepage">
                       <h3>Nothing to show</h3>
                    </div>
                    <Dropdown isOpen={dropdownOpen} toggle={toggle} id="drop">
                            <DropdownToggle caret size="lg" color = 'primary'>
                             {uname}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem><Link to="/" onClikc={Logout}>Logout</Link></DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                </React.Fragment>
                
            ) 
        }
    }
}

export default Home