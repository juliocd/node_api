#!/usr/bin/env node

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var cfg = require('../config');

var app = express();

//Allow origin
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
     next();
})

//express.static will serve everything
// with in client as a static resource
// also, use index.html file like a root.
app.use(express.static('client'));

//body parser makes it possible to POST JSON to the server
//we can access data we post on as req.body
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

require('../server/request.js')(app);//Module with the request routes

app.put('/user/:id', function(req, res){

    jwt.verify(req.headers.token, cfg.secret_key, function(err, decoded) {
        if(err){
            res.status(403).send("Access forbidden.");
        }else{
            var user = req.body;
            
            var sql = "UPDATE users SET " 
                + " name = '" + user.name + "',  "
                + " last_name = '" + user.last_name + "', "
                + " age = " + user.age + ", "
                + " gender = '" + user.gender + "', "
                + " username = '" + user.username + "', "
                + " password = '" + user.password + "' WHERE id = " + req.params.id;
            con.query(sql, function (err, result) {
                if (err) {
                    res.send(err);
                }
                if(result.affectedRows == 1){
                    console.log("User updated");
                    user.id = req.params.id;
                    res.send(user);
                }else{
                    console.log("User not found");
                    res.send({"error" : "User not found"});
                }
            });
        }
    });
});

app.delete('/user/:id', function(req, res){
    jwt.verify(req.headers.token, cfg.secret_key, function(err, decoded) {
        if(err){
            res.status(403).send("Access forbidden.");
        }
        else{
            var sql = "DELETE FROM users WHERE id = " + req.params.id;
            con.query(sql, function (err, result) {
                if (err) {
                    res.send(err);
                }
                console.log("User deleted");
                res.send(result);
            });
        }
    });
})

app.get('/signout', function(req, res){
    
})

/*var jsonData = {count: 12, message: 'hey'};
app.get('/', function(req, res) {

    //Using sendFile
    // res.sendFile(__dirname + '/index.html', function(err){
    //     if(err){
    //         res.status(500).send(err);
    //     }
    // })

    //Using fs
    fs.readFile('index.html', function(err, buffer){
        var html = buffer.toString();

        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    })

  });

app.get('/data', function(req, res) {
  // send back a json response
  res.json(jsonData);
});*/

//Handler-error
// app.use(function(err, req, res, next){
//     console.log("Error ooooh!");
//     console.error(err);
//     next();
// })

// start server on port 3000
var port = process.env.PORT || cfg.port;
app.listen(port, function(){
    console.log('Server running on http://localhost:', port)
});
