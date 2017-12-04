var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var _ = require('lodash')
var mysql = require('mysql');

var app = express();

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
    host: "127.0.0.1",
    user: "node_user",
    password: "password",
    database: "api_user"
});

//Connect to database
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    // con.query("CREATE DATABASE IF NOT EXISTS api_user", function (err, result) {
    //     if (err) throw err;
    //     console.log("Database OK!");
    // });
    // con.query("CREATE TABLE IF NOT EXISTS users ( id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, age INT(3), gender VARCHAR(1), username VARCHAR(50) NOT NULL, password VARCHAR(50) NOT NULL);", function (err, result) {
    //     if (err) throw err;
    //     console.log("User table OK!");
    // });
});

app.post('/user', function(req, res) {
    var user = req.body;

    var sql = "INSERT INTO users (name, last_name, age, gender, username, password) " 
        + "VALUES ('" + user.name + "','" + user.last_name + "'," + user.age + ",'" 
        + user.gender + "','" + user.username + "','" + user.password + "')";
    con.query(sql, function (err, result) {
        if (err) {
            res.send(err);
        }
        console.log("user inserted");
        user.id = result.insertId;
        res.send(user);
    });
});

app.get('/users', function(req, res) {
    var sql = "SELECT * FROM users";
    con.query(sql, function (err, result) {
        if (err) {
            res.send(err);
        }
        console.log("Users: " + result);
        res.send(result);
    });
});

app.put('/user/:id', function(req, res){
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
});

app.delete('/user/:id', function(req, res){
    var sql = "DELETE FROM users WHERE id = " + req.params.id;
    con.query(sql, function (err, result) {
        if (err) {
            res.send(err);
        }
        console.log("User deleted");
        res.send(result);
    });
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

// start server on port 3000
var port = 3000;
app.listen(port, function(){
    console.log('Server running on http://localhost:', port)
});