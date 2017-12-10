var mysql = require('mysql');
var cfg = require('../config');
var con = null;

exports.connect = function (callback){

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
        // con.query("CREATE TABLE IF NOT EXISTS users ( id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, age INT(3), gender VARCHAR(1), username VARCHAR(50) NOT NULL, password VARCHAR(120) NOT NULL);", function (err, result) {
        //     if (err) throw err;
        //     console.log("User table OK!");
        // });
        // con.query("ALTER TABLE users MODIFY COLUMN password VARCHAR(120);", function (err, result) {
        //     if (err) throw err;
        //     console.log("User table OK!");
        // });
        return callback(con);
    });
}