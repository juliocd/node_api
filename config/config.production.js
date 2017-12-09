var config = require('./config.global');

config.env = 'production';
config.hostname = 'https://apinodeusers.herokuapp.com';
config.root = '/';

config.mysql = {};
config.mysql.host = "sql9.freemysqlhosting.net",
config.mysql.user = "sql9208893",
config.mysql.password = "d69M8DDdpz",
config.mysql.database = "sql9208893",
config.mysql.port = 3306

module.exports = config;