var cfg = require('../config');
var jwt = require('jsonwebtoken');
var util = require('./util.js');
// Here we import our Logger file and instantiate a logger object
var logger = require("./logger").Logger;

module.exports = function (app){
    app.post('/user', function(req, res) {
        var user = require(__dirname + '/services/user.js');
		user.save(req.body, function(response){
            return res.send(response);
		});
    });

    app.post('/sms-notifications', function(req, res) {
        logger.info("Input data", req.body);
    });

    app.get('/users', function(req, res) {
        jwt.verify(req.headers.token, cfg.secret_key, function(err, decoded) {
            if(err){
                var jsonResponse = util.jsonResponse();
                jsonResponse.code = 403;
                jsonResponse.error = "Access forbidden.";
                res.send(jsonResponse);
            }else{
                var user = require(__dirname + '/services/user.js');
                user.obtainAll(function(response){
                    return res.send(response);
                });
            }
        });
    });

    app.post('/signin', function(req, res) {
        var application = require(__dirname + '/services/application.js');
		application.signin(req.body, function(response){
            return res.send(response);
		});
    });
}