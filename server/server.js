#!/usr/bin/env node

var express = require('express');
var bodyParser = require('body-parser');
var sha256 = require('sha256');
var fs = require('fs');
var _ = require('lodash')
var mysql = require('mysql');
var cfg = require('../config');
var jwt = require('jsonwebtoken');

var app = express();

//First Middleware
// app.use(function(req, res, next){
//     console.log("first mwre 2");
//     next();
// })

//express.static will serve everything
// with in client as a static resource
// also, use index.html file like a root.
app.use(express.static('client'));

//body parser makes it possible to POST JSON to the server
//we can access data we post on as req.body
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//Create database connection
var con = mysql.createConnection({
    host: cfg.mysql.host,
    user: cfg.mysql.user,
    password: cfg.mysql.password,
    database: cfg.mysql.database,
    port: cfg.mysql.port
});

//Connect to database
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    // con.query("CREATE DATABASE IF NOT EXISTS api_user", function (err, result) {
    //     if (err) throw err;
    //     console.log("Database OK!");
    // });
     /*con.query("CREATE TABLE IF NOT EXISTS users ( id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, age INT(3), gender VARCHAR(1), username VARCHAR(50) NOT NULL, password VARCHAR(120) NOT NULL);", function (err, result) {
         if (err) throw err;
         console.log("User table OK!");
     });*/
     /*con.query("ALTER TABLE users MODIFY COLUMN password VARCHAR(120);", function (err, result) {
        if (err) throw err;
        console.log("User table OK!");
    });*/
});

app.post('/user', function(req, res) {
    var user = req.body;
    var jsonResponse = {
        code : 200,
        error : "",
        data : null
    };

    var sql = "INSERT INTO users (name, last_name, age, gender, username, password) " 
        + "VALUES ('" + user.name + "','" + user.last_name + "'," + user.age + ",'" 
        + user.gender + "','" + user.username + "','" + user.password + "')";
    con.query(sql, function (err, result) {
        if (err) {
            console.log("Error insering user. Desc: " + err);
            jsonResponse.code = 404;
            jsonResponse.error = err;
        }else{
            console.log("User inserted successfully with sql: " + sql);
            user.id = result.insertId;
            jsonResponse.data = user;
        }
        res.send(jsonResponse);
    });
});

app.get('/users', function(req, res) {
    jwt.verify(req.headers.token, cfg.secret_key, function(err, decoded) {
        if(err){
            res.status(403).send("Access forbidden.");
        }else{
            var sql = "SELECT * FROM users";
            con.query(sql, function (err, result) {
                if (err) {
                    res.send(err);
                }
                console.log("Users: " + result);
                res.send(result);
            });
        }
    });

    //next(new Error('Ester errood'));
});

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

app.post('/signin', function(req, res) {
    var user = req.body;
    var jsonResponse = {
        code : 200,
        error : "",
        data : null
    };

    var sql = "SELECT id, name, last_name, age, gender FROM users WHERE username = '" + user.username + "' AND password = '" + user.password + "';";
    con.query(sql, function (err, result) {
        if (err) {
            console.log("Error sign in user. Desc: " + err);
            jsonResponse.code = 404;
            jsonResponse.error = err;
        }else{
            if(result.length > 0){
                var userData = result[0];
                var token = jwt.sign(sha256(userData.id), cfg.secret_key);
                console.log("User " + user.username + " signed in successfully");
                jsonResponse.data = token;
            }else{
                jsonResponse.code = 202;
            }
        }
        res.send(jsonResponse);
    });
});

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
