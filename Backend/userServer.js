const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fs = require('fs');
const glob = require("glob");
const { isBooleanObject } = require('util/types');
var cors = require('cors');

//This function links the react frontend component requests to the backend server.
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//This functions handles the register request for new users, saves their information to a folder
//called users in .json format. The username of an account is the key, so if the user registering
//chooses a user already in use, the request throws an error 401.
app.post('/register', function(req, res){
    if(!req.body.username || !req.body.password){
        res.status("400");
        return res.send("Missing Fields!");
    }
    else{
        var Account = {username: req.body.username, password: req.body.password};
        var path = "Users/" + req.body.username +".json"
        if (fs.existsSync(path)) {
            return res.status(401).send("Account Already Exists!");
          } 
        var str = JSON.stringify(Account, null, 2);
        fs.writeFile("Users/" + req.body.username + ".json", str, function(err){
            var rsp_obj = {};
            rsp_obj.message = "Successfully created";
            return res.status(200).send(rsp_obj);
        });
    }
});

//This function takes in the login credentials from login.js. It first off starts by checking to see if the 
//username exists in the user database, if not it returns a 404 error. If the username exists but the password is incorrect,
//it returns an error 405. If both the username and password match, and returns back as a successful request and pushes
//the user to the homepage of the site.
app.post('/', function(req, res){
    console.log('connection successful');
    console.log(req.body);
    console.log(req.body.username);
    let username = req.body.username;
    fs.readFile("Users/" + username + ".json", "utf8", function(err, data){
        if(err){
            return res.status(404).send("Account Does Not Exist.")
        }
        var jsonArr = JSON.parse(data);
        if(jsonArr.password != req.body.password){
            return res.status(405).send("Password Does Not Match.")
        }
        else{
            return res.status(200).send("Success!")
        }
    });
});

app.listen(3001);
console.log("Server started")