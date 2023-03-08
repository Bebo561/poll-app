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

var userList = new Set();
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
            return res.status(201).send(rsp_obj);
        });
    }
});

app.listen(3001);
console.log("Server started")