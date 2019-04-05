var cfg = require('../config');
var jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
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
        try{
            logger.info("Body:>>>");
            logger.info(JSON.stringify(req));
            logger.info("Body:<<<<<");
            logger.info("************");
            logger.info(JSON.stringify(req.body));
            logger.info("<<<");
            res.status(200).json('Success')
        }catch(err){
            logger.error("Error >>>");
            logger.error(err);
            logger.error("Error <<<");
            res.status(500).json('Error')
        }
    });

    app.get('/logs', function(req, res) {
        const filename = path.join(__dirname, '..', 'logs', 'info.txt');
        console.log(filename);
        var contents = fs.readFileSync(filename, 'utf8');
        res.status(200).send(contents)
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