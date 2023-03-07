const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fs = require('fs');
const glob = require("glob");
const { isBooleanObject } = require('util/types');
var cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

var userList = [];
app.post('/register', function(req, res){
    if(!req.body.username || !req.body.password){
        res.status("400");
        res.end("Missing Fields!");
    }
    else{
        userList.filter(function(user){
            if(userList.username === req.body.username){
                res.render('register',{
                    message: "User name already exists, choose another"});
            }
        });
        var newAccount = {username: req.body.username, password: req.body.password};
        userList.push(newUser);
        req.session.user = newAccount;
        res.redirect('/home');
    }
    var obj = {};
    obj.username = req.body.username;
    obj.password = req.body.password;

    var str = JSON.stringify(obj, null, 2);
    fs.writeFile("Users/" + req.body.username + ".json", str, function(err){
        var rsp_obj = {};
        if(err){
            rsp_obj.username = null;
            rsp_obj.message = 'Error - Username failed to create.'
            return res.status(200).send(rsp_obj);
        }
        else{
            rsp_obj.username = req.body.username;
            rsp_obj.message = "Successfully created";
            return res.status(201).send(rsp_obj);
        }
    });
});

app.listen(3001);
console.log("Server started")