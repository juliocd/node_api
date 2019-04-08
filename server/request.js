var cfg = require('../config');
var jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
var util = require('./util.js');
// Here we import our Logger file and instantiate a logger object
var logger = require("./logger").Logger;

module.exports = function (app){

    app.use(function (req, res, next) {
        if (req.get('x-amz-sns-message-type')) {
            logger.info("Update content-type");
        req.headers['content-type'] = 'application/json';
        }
        next();
      });
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',
    extended: false
}));

    app.post('/user', function(req, res) {
        var user = require(__dirname + '/services/user.js');
		user.save(req.body, function(response){
            return res.send(response);
		});
    });

    app.post('/sms-notifications', function(req, res) {
        try{
            logger.info("Body:>>>");
            logger.info("************");
            logger.info(JSON.stringify(req.headers));
            logger.info("<<<");
            res.status(200).json('Success')
        }catch(err){
            logger.error("Error >>>");
            logger.error(err);
            logger.error("Error <<<");
            res.status(500).json('Error')
        }
    });

    app.post('/sns', function(req, res) {
        try{
            if (req.get("x-amz-sns-message-type") == "SubscriptionConfirmation") {
                logger.info("************");
                logger.info("arn");
                console.log(req.get("x-amz-sns-topic-arn"));
                const subscribeUrl = req.body.SubscribeURL;
                logger.info("************");
                logger.info("subscribeUrl");
                console.log(subscribeUrl);
            }
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