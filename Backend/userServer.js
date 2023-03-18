const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fs = require('fs');
const glob = require("glob");
const { isBooleanObject } = require('util/types');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const { connect } = require('http2');

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

const userSchema = new mongoose.Schema({
    username:{
        required: true,
        type: String
    }, 
    password:{
        required: true,
        type: String
    }
});

var userModel = mongoose.model('user', userSchema);


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
app.post('/', function(req, res){
    console.log('connection successful');
    if(!req.body.username || !req.body.password){
        return res.status('400').json({message:"Error, Missing Fields"});
    }
    let username = req.body.username;
    let pword = JSON.stringify(req.body.password);
    fs.readFile("Users/" + username + ".json", "utf8", function(err, data){
        if(err){
            return res.status(404).json({message:"Error, Username Does Not Exist"});
        }
        var jsonArr = JSON.parse(data);
        PasswordChecker(pword, jsonArr, res);
    });
});

async function PasswordChecker(pword, jsonArr, res){
    var x = await bcryptjs.compare(pword, jsonArr.password);
    if(x === false){
        return res.status(405).json({message:"Error, Passwords Do Not Match"});
    }
    else{
        return res.status(200).send("Success!")
    }
}

//This function receives input from createVote.js, it creates the poll data and stores it in the poll folder for the 
//homepage to access later. Works identically to the user registration function.
app.post('/createVote', function(req, res){
    console.log('Connection Successful');
    console.log(req.body);
    if(!req.body.pollName || !req.body.Option1 || !req.body.Option2 || !req.body.Option3){
        return res.status(400).json({message:"Error, Missing Fields"});
    }
    else{
        var str = JSON.stringify(req.body, null, 2);
        console.log(req.body.pollName);
        var path = "Polls/" + req.body.pollName + ".json";
        if (fs.existsSync(path)) {
            return res.status(401).json({message:"Error, Poll Already Exists"});
        } 
        fs.writeFile(path, str, function(err){
            return res.status(200).send("Success!");
        });
    }
});

//Helper function that reads all data from Poll folder to push it to the front homepage.
function readFiles(files, arr, res){
    pname = files.pop();
    if(!pname){
        return;
    }
    fs.readFile(pname, "utf8", function(err, data){
        if(err){
            return res.status(404).json({message: "Error- Internal Server Error"});
        }
        else{
            arr.push(JSON.parse(data));
            if(files.length == 0){
                var obj = {};
                obj.polls = arr;
                console.log(obj);
                return res.status(200).send(obj);
            }
            else{
                readFiles(files, arr, res);
            }
        }
    });
}

//This function retrieves all of the polls from the local directory and puts them on the homepage.
app.get('/home', function(req, res){
    filesread = 0;
    glob("Polls/*.json", null, function(err, files){
        if(err){
            return res.status(404).json({message: "Error- Internal Server Error"});
        }
        readFiles(files, [], res)
    })
});

//Put function, which is called whenever a user submits their votes. It essentially checks first to see if the user has
//already voted by checking the users array in the json file, which holdes the usernames of people who have voted.
//If they are found, the function returns an error, if not, the function adds their name to an obj copy of the json information.
//The function then checks to see what option was picked, and then increments the votes in that option by one. Finally,
//the function writes to the poll's json file and updates all information fields as needed.
app.put('/poll', function(req, res){
    var pname = req.body.pollName;
    var path = 'Polls/' + pname + '.json';
    var option = req.body.option;
    var user = req.body.users
    var obj = {};
    fs.readFile(path, "utf8", function(err, data) {
        if (err) {
            return res.status(404).json({message: "Error- Internal Server Error"});
        } 
        else {
            obj = JSON.parse(data);
            for(var i = 0; i < obj.users.length; i++){
                if(user === obj.users[i]){
                    return res.status(404).json({message: "Error - User Has Already Voted"});
                }
            }
          if(option === "Option1"){
            obj.numOfVotes1 += 1;
          }
          if(option === "Option2"){
            obj.numOfVotes2 += 1;
          }
          if(option === "Option3"){
            obj.numOfVotes3 += 1;
          }
          obj.users.push(user);
        }
        var str = JSON.stringify(obj, null, 2);
        fs.writeFile(path, str, function(err) {
            if(err) {
                return res.status(404).json({message: "Error-Unable To Update"});
            } else {
              return res.status(200).json({message: "Success"});
            }
          });
      });
});

//Delete function, essentially what it does is it first checks if the poll can be accessed, if not it return an error.
//Then the function checks if the user requesting a deletion is also the same user who made the poll, if they are not
//the function will return an error message informing them they cannot delete what they did not create. If the user
//does match the creator of the post, the post is deleted and returns the message success. 
app.delete('/delete', function(req, res){
    var pname = req.body.del.pollName;
    var delUser = req.body.del.admin;
    var path = 'Polls/' + pname + '.json';
    console.log(req.body.del);
    var obj = {};
    fs.readFile(path, "utf-8", function(err, data) {
        if (err) {
            return res.status(404).json({message: "Error- Internal Server Error"});
        } 
        else{
            obj = JSON.parse(data);
            console.log(obj.admin.length)
            for(var i = 0; i < obj.admin.length; i++){
                if(delUser !== obj.admin[i]){
                    return res.status(404).json({message: "Error - Did Not Create Post"});
                }
            }
            fs.unlink(path, function(err){
                if(err){
                    return res.status(404).json({message: "Error-Unable To Delete"});
                }
                else{
                    return res.status(200).json({message: "Success!"});
                }
            });
        }
    });
})
app.listen(3001);
console.log("Server started")