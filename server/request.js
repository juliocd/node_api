var cfg = require('../config');
var jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
var util = require('./util.js');
const bodyParser = require('body-parser')
// Here we import our Logger file and instantiate a logger object
var logger = require("./logger").Logger;
var Promise = require('promise');
const request = require('request');

module.exports = function (app){

    app.post('/user', function(req, res) {
        var user = require(__dirname + '/services/user.js');
		user.save(req.body, function(response){
            return res.send(response);
		});
    });

    app.post('/sms-notifications', bodyParser.json(), bodyParser.urlencoded({ extended: false }), function(req, res) {
        let body = ''

        req.on('data', (chunk) => {
            body += chunk.toString()
        })

        req.on('end', () => {
            let payload = JSON.parse(body)

            if (payload.Type === 'SubscriptionConfirmation') {
                console.log('SubscribeURL', payload.SubscribeURL)
            const promise = new Promise((resolve, reject) => {
                const url = payload.SubscribeURL

                request(url, (error, response) => {
                if (!error && response.statusCode == 200) {
                    console.log('Yess! We have accepted the confirmation from AWS')
                    return resolve()
                } else {
                    return reject()
                }
                })
            })

            promise.then(() => {
                res.end("ok")
            })
            }
        })
    });

    app.post('/sns', bodyParser.json(), bodyParser.urlencoded({ extended: false }), function(req, res) {
        let body = ''

        req.on('data', (chunk) => {
            body += chunk.toString()
        })

        req.on('end', () => {
            let payload = JSON.parse(body)

            if (payload.Type === 'SubscriptionConfirmation') {
                logger.error(">>>>" + payload.SubscribeURL);
                console.log('payload', payload)
            const promise = new Promise((resolve, reject) => {
                const url = payload.SubscribeURL

                request(url, (error, response) => {
                if (!error && response.statusCode == 200) {
                    console.log('Yess! We have accepted the confirmation from AWS')
                    return resolve()
                } else {
                    return reject()
                }
                })
            })

            promise.then(() => {
                res.status(200).json('Success')
            })
            }
        })
    });

    app.post('/send-confirmation', function(req, res) {

        let url = req.body.subscribeURL;
        console.log('url', url)
        const promise = new Promise((resolve, reject) => {
            request(url, (error, response) => {
                if (!error && response.statusCode == 200) {
                    console.log('Yess! We have accepted the confirmation from AWS')
                    return resolve()
                } else {
                    console.log(error)
                    return reject()
                }
            })
        });
        promise.then(() => {
            res.status(200).json('Confiramtion success')
        }).catch((err) => {
            console.log(err);
            res.status(500).json('Error success')
        });
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