const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fs = require('fs');
const glob = require("glob")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('./public'));

app.post('/Users', function(req, res){
    var obj = {};
    obj.username = req.username;
    obj.password = req.password;
    
    var str = JSON.stringify(obj, null, 2);
    fs.writeFile("Users/" + req.username + ".json", str, function(err){
        var rsp_obj = {};
        if(err){
            rsp_obj.username = null;
            rsp_obj.message = 'Error - Username failed to create.'
            return res.status(200).send(rsp_obj);
        }
        else{
            rsp_obj.username = req.username;
            rsp_obj.message = "Successfully created";
            return res.status(201).send(rsp_obj);
        }
    });
});

app.listen(8080);
console.log("Server started")