const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { isBooleanObject } = require('util/types');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const bcryptjs = require('bcryptjs');

//Number of rounds the passwords will undergo hashing, the higher the more secure however it would add a delay to 
//sign in and register functions.
const saltRounds = 10;

//Retrieves database url from dotenv file, connects to database.
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

//Once contact is made with the database, informs the developer that the connnection was secure.
database.once('connection', () =>{
    console.log("Connected to Database!")
});

//Imports the user schema and poll schema from their respective files
const uModel = require('./userModel');
const pModel = require('./pollModel');

//Assigns the schema models to variables to be used in each API request.
var userModel = uModel;
var pollModel = pModel;

//Function that is called when users are registered.
app.post('/register', async function(req, res){
    //If any field of the request is missing, that means users failed to input. Return error and notify user of their error.
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message:"Error- Missing Fields"});
    }
    else{
        //Check if the user already exists, if they do return an error to the user and tell them username is taken.
        var x = await userModel.find({username: req.body.username}).count();
        if(x > 0){
            return res.status(400).json({message:"Error- Username Taken"});
        }
        else{
            //If account does not already exits, hash password, and send password over to database.
            const hashPword = await bcryptjs.hash(req.body.password, saltRounds);
            const data = await userModel.create({
                username: req.body.username,
                password: hashPword
            });
            try{
                //saves data of the user to mongoDb with password hashed.
                await data.save();
                res.status(200).json({message: "Success!"})
            }catch(error){
                //If an error occurs with saving, return an error and notify the user it was a server error.
                res.status(400).json({message: "Error- Server Error"});
            }
        }
    }
});

//Function that is called everytime a user tries to login
app.post('/', async function(req, res){
    //If a field is missing from the request body, means user failed to enter input. Return error and notify user of error.
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message:"Error, Missing Fields"});
    }
    //Checks if the username the user is trying to sign in with exits, if not return error and notify user that their 
    //username is wrong.
    var x = await userModel.find({username: req.body.username}).count();
    if(x === 0){
        return res.status(401).json({message:"Error, Username Incorrect"});
    }
    else{
        var userData = await userModel.findOne({username: req.body.username});
        //If user inputted username and password correctly, query the database for the schema matching username.
        //Compare password with hashed password.
        if(userData !== null){
            var compare = await bcryptjs.compare(req.body.password, userData.password);
            //If passwords match, inform the user their login was a success and push them into homepage.
            if(compare){
                res.status(200).json({message: "Success!"});
            }
            else{
                //Password was incorrect, throw error and inform user of incorrect password.
                res.status(400).json({message: "Error, Incorrect Password"});
            }
        }
    }
});



//This function receives input from createVote.js, it creates the poll data and stores it in mongodb poll collection.
app.post('/createVote', async function(req, res){
    //If the user failed to input any data field, return error and inform user of error.
    if(!req.body.pollName || !req.body.Option1 || !req.body.Option2 || !req.body.Option3){
        return res.status(400).json({message:"Error, Missing Fields"});
    }
    else{
        //Check if the poll already exits, if it does return error and inform user poll already exists.
        var x = await pollModel.find({pollName: req.body.pollName}).count();
        if(x >0){
            return res.status(400).json({message:"Error, Poll Already exists!"});
        }
        else{
            //Creates model of data that will be sent to the database. The reason voted and admin are both arrays of strings 
            //is due to the fact that json is stored differently then regular strings. This means that verification through
            //string comparison is not possible unless the json stores a string inside an array object.
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
                //Saves the user inputted poll to the database, informs user of success.
                pollData.save();
                return res.status(200).json({message: "Success"});
            }catch(error){
                //If there was an error saving to database, inform user of server error.
                return res.status(400).json({message:"Error- Server Error"});
            }
        }
    }
});

//This function retrieves all of the polls from the local directory and puts them on the homepage. Called anytime
//the user loads the homepage.
app.get('/home', async function(req, res){
    try{
        //Finds all polls in database, saves them to variable, and finally variable is sent to front end for its data
        //to be displayed.
        const polls = await pollModel.find();
        res.status(200).send(polls);
    }catch(error){
        //If an error occurs fetching poll data, inform user of server error.
        res.status(400).status({message:"Error, Server Error"});
    }
});

//Put function, called whenever a user submits a vote.
app.put('/poll', async function(req, res){
    var pname = req.body.pollName;
    var option = req.body.option;
    var user = req.body.users

    var poll = await pollModel.findOne({pollName: pname});
    //Loads poll that user voted on.
    if(poll !== null){
        //for loop checks if the user has previously voted on the poll before. If they have, return error
        //and inform user they cannot vote because they have already voted on this poll.
        for(var i = 0; i < poll.Voted.length; i++){
            if(user === poll.Voted[i]){
                return res.status(400).json({message: "Error, User Has Already Voted"});
            }
        }
        //Checks which option the user voted on, increments the options respective voting amount, and then adds the user
        //to the array of users who have previously voted on that poll.
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

//Delete function, which is called whenever a user tries to delete a poll.
app.delete('/delete', async function(req, res){
    var pname = req.body.del.pollName;
    var user = req.body.del.admin;
    //Loads poll that user is trying to delete.
    var poll = await pollModel.findOne({pollName: pname});
    if(poll !== null){
        //Checks if the user trying to delete the poll is also the respective creator of the poll.
        //If the user is not the creator, return error and inform the user they cannot delete the poll as they did not create it.
        for(var i = 0; i < poll.Admin.length; i++){
            if(poll.Admin[i] !== user){
                return res.status(400).json({message: "Error- You Cannot Delete A Poll You Did Not Create"});
            }
        }
        //If the user is found to be the creator of the poll, delete the poll.
        await pollModel.findOneAndDelete({pollName: pname});
        res.status(200).json({message: "Success!"});
    }
    
})
app.listen(3001);
console.log("Server started")