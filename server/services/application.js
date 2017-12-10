var db = require('../db.js');
var util = require('../util.js');
var jwt = require('jsonwebtoken');
var sha256 = require('sha256');
var cfg = require('../../config');

var Application = {

    signin : function(user, callBack){
        var sql = "SELECT id, name, last_name, age, gender FROM users WHERE username = '" + user.username + "' AND password = '" + user.password + "';";
        db.connect(function (con) {
            con.query(sql, function (err, result) {
                var jsonResponse = util.jsonResponse();
                if (err) {
                    jsonResponse.code = 404;
                    jsonResponse.error = err;
                }else{
                    if(result.length > 0){
                        var userData = result[0];
                        jsonResponse.data = {};
                        jsonResponse.data.token = jwt.sign(sha256(userData.id), cfg.secret_key);;
                    }else{
                        jsonResponse.code = 202;
                    }
                }
                console.log(jsonResponse);
                callBack(jsonResponse);
            });
        });
    }

}

exports.signin = function(user, callBack){
    return Application.signin(user, callBack);
}