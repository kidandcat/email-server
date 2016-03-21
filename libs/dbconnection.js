var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'galax.be',
    user: 'admin',
    password: '3corazoness.',
    database: 'emails'
});

connection.connect();


module.exports = connection;