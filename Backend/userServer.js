const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { isBooleanObject } = require('util/types');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const bcryptjs = require('bcryptjs');


const saltRounds = 10;

const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL);
const database = mongoose.connection;
//This function links the react frontend component requests to the backend server.
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

database.once('connection', () =>{
    console.log("Connected to Database!")
});

const uModel = require('./userModel');
const pModel = require('./pollModel');

var userModel = uModel;
var pollModel = pModel;

//This functions handles the register request for new users, saves their information to a folder
//called users in .json format. The username of an account is the key, so if the user registering
//chooses a user already in use, the request throws an error 401.
app.post('/register', async function(req, res){
    if(!req.body.username || !req.body.password){

        return res.status(400).json({message:"Error, Missing Fields"});
    }
    else{
        var x = await userModel.find({username: req.body.username}).count();
        if(x > 0){
            return res.status(400).json({message:"Error, Account Already Exists"});
        }
        else{
        const hashPword = await bcryptjs.hash(req.body.password, saltRounds);
        const data = await userModel.create({
            username: req.body.username,
            password: hashPword
        });
        try{
            await data.save();
            console.log(data);
            console.log("Success")
            res.status(200).json({message: "Success!"})
        }catch(error){
            res.status(400).json({message: "Error"});
        }
    }
    }
});

//This function takes in the login credentials from login.js. It first off starts by checking to see if the 
//username exists in the user database, if not it returns a 404 error. If the username exists but the password is incorrect,
//it returns an error 405. If both the username and password match, and returns back as a successful request and pushes
//the user to the homepage of the site.
app.post('/', async function(req, res){
    console.log('connection successful');
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message:"Error, Missing Fields"});
    }
    var x = await userModel.find({username: req.body.username}).count();
    if(x === 0){
        return res.status(401).json({message:"Error, User Does Not Exist"});
    }
    else{
        var userData = await userModel.findOne({username: req.body.username});
        if(userData !== null){
            
            var compare = await bcryptjs.compare(req.body.password, userData.password);
            if(compare){
                console.log(compare)
                res.status(200).json({message: "Success!"});
            }
            else{
                res.status(400).json({message: "Error, Incorrect Password"});
            }
        }
    }
});



//This function receives input from createVote.js, it creates the poll data and stores it in the poll folder for the 
//homepage to access later. Works identically to the user registration function.
app.post('/createVote', async function(req, res){
    console.log('Connection Successful');
    console.log(req.body);
    if(!req.body.pollName || !req.body.Option1 || !req.body.Option2 || !req.body.Option3){
        return res.status(400).json({message:"Error, Missing Fields"});
    }
    else{
        var x = await pollModel.find({pollName: req.body.pollName}).count();
        if(x >0){
            return res.status(400).json({message:"Error, Poll Already exists!"});
        }
        else{
            const pollData = new pollModel({
                pollName: req.body.pollName, 
                Option1: req.body.Option1,
                numOfVotes1: 0,
                Option2: req.body.Option2,
                numOfVotes2: 0,
                Option3: req.body.Option3,
                numOfVotes3: 0,
                Voted: "",
                Admin: req.body.admin
            });
            try{
                console.log("worked")
                pollData.save();
                return res.status(200).json({message: "Success"});
            }catch(error){
                return res.status(400).json({message:"Error, Server Error"});
            }
        }
    }
});

//This function retrieves all of the polls from the local directory and puts them on the homepage.
app.get('/home', async function(req, res){
    try{
        const polls = await pollModel.find();
        res.status(200).send(polls);
    }catch(error){
        res.status(400).status({message:"Error, Server Error"});
    }
});

//Put function, which is called whenever a user submits their votes. It essentially checks first to see if the user has
//already voted by checking the users array in the json file, which holdes the usernames of people who have voted.
//If they are found, the function returns an error, if not, the function adds their name to an obj copy of the json information.
//The function then checks to see what option was picked, and then increments the votes in that option by one. Finally,
//the function writes to the poll's json file and updates all information fields as needed.
app.put('/poll', async function(req, res){
    var pname = req.body.pollName;
    var option = req.body.option;
    var user = req.body.users

    var poll = await pollModel.findOne({pollName: pname});
    if(poll !== null){
        for(var i = 0; i < poll.Voted.length; i++){
            if(user === poll.Voted[i]){
                return res.status(400).json({message: "Error, User Has Already Voted"});
            }
        }
        if(option === "Option1"){
            await pollModel.findOneAndUpdate({pollName: pname}, {$inc:{numOfVotes1: 1}});
            await pollModel.findOneAndUpdate({pollName: pname}, { $push: { Voted: user } });
            return res.status(200).json({message: "Success!"});
        }
        if(option === "Option2"){
            await pollModel.findOneAndUpdate({pollName: pname}, {$inc:{numOfVotes2: 1}});
            await pollModel.findOneAndUpdate({pollName: pname}, { $push: { Voted: user } });
            return res.status(200).json({message: "Success!"});
        }
        if(option === "Option3"){
            await pollModel.findOneAndUpdate({pollName: pname}, {$inc:{numOfVotes3: 1}});
            await pollModel.findOneAndUpdate({pollName: pname}, { $push: { Voted: user } });
            return res.status(200).json({message: "Success!"});
        }
    }
   
    
        
});

//Delete function, essentially what it does is it first checks if the poll can be accessed, if not it return an error.
//Then the function checks if the user requesting a deletion is also the same user who made the poll, if they are not
//the function will return an error message informing them they cannot delete what they did not create. If the user
//does match the creator of the post, the post is deleted and returns the message success. 
app.delete('/delete', async function(req, res){
    var pname = req.body.del.pollName;
    var user = req.body.del.admin;
    var poll = await pollModel.findOne({pollName: pname});
    if(poll !== null){
        console.log(poll)
        for(var i = 0; i < poll.Admin.length; i++){
            if(poll.Admin[i] !== user){
                return res.status(400).json({message: "Error- You Cannot Delete A Poll You Did Not Create"});
            }
        }
        await pollModel.findOneAndDelete({pollName: pname});
        res.status(200).json({message: "Success!"});
    }
    
})
app.listen(3001);
console.log("Server started")