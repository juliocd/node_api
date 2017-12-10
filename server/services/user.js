var db = require('../db.js');
var util = require('../util.js');

var User = {

    save : function (user, callBack){
        var sql = "INSERT INTO users (name, last_name, age, gender, username, password) " 
            + "VALUES ('" + user.name + "','" + user.last_name + "'," + user.age + ",'" 
            + user.gender + "','" + user.username + "','" + user.password + "')";
        db.connect(function (con) {
            con.query(sql, function (err, result) {
                var jsonResponse = util.jsonResponse();
                if (err) {
                    jsonResponse.code = 404;
                    jsonResponse.error = err;
                }else{
                    user.id = result.insertId;
                    jsonResponse.data = user;
                }
                console.log(jsonResponse);
                callBack(jsonResponse);
            });
        });
    },

    obtainAll : function(callBack){
        var sql = "SELECT * FROM users";
        db.connect(function (con) {
            con.query(sql, function (err, result) {
                var jsonResponse = util.jsonResponse();
                if (err) {
                    jsonResponse.code = 404;
                    jsonResponse.error = err;
                }else{
                    jsonResponse.data = result;
                }
                console.log(jsonResponse);
                callBack(jsonResponse);
            });
        });
    } 

}

exports.save = function(user, callBack){
	return User.save(user, callBack);
};

exports.obtainAll = function(callBack){
	return User.obtainAll(callBack);
};