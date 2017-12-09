//$NODE_ENV=development nodemon server/server.js
var env = process.env.NODE_ENV || 'production'
, cfg = require('./config.'+env);

module.exports = cfg;