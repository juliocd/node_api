var config = require('./config.global');

config.env = 'development';
config.hostname = 'http://localhost';
config.port = 3000;
config.root = '/';

config.mysql = {};
config.mysql.host = "127.0.0.1";
config.mysql.user = "node_user";
config.mysql.password = "password";
config.mysql.database = "api_user";
config.mysql.port = 3306;

module.exports = config;