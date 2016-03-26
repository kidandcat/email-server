var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var connection = require('./libs/dbconnection');



var app = express();

var httpServer = http.createServer(app);
httpServer.listen(8008);

module.exports = httpServer;



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));



//app.get('/login/:user/:password', function(req, res) {
    // post to 127.0.0.1:8010 /email/new/
//});

app.get('/login/:user/:password', function(req, res) {
    if (req.params.user != 'admin') {
        console.log("SELECT * FROM users WHERE nick = '" + req.params.user + "' AND password = '" + req.params.password + "'");
        connection.query("SELECT * FROM users WHERE nick = '" + req.params.user + "' AND password = '" + req.params.password + "'", function(err, rows, fields) {
            if (err) {
                console.log(err);
            } else {
                console.log(rows[0]);
                if (typeof rows[0] != 'undefined') {
                    connection.query("SELECT * FROM emails WHERE _to = '" + req.params.user + "@galax.be' order by date desc", function(err, rows, fields) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.json(rows);
                        }
                    });
                }
            }
        });
    } else {
        console.log("SELECT * FROM users WHERE nick = '" + req.params.user + "' AND password = '" + req.params.password + "'");
        connection.query("SELECT * FROM users WHERE nick = 'admin' AND password = '" + req.params.password + "'", function(err, rows, fields) {
            if (err) {
                console.log(err);
            } else {
                console.log(rows[0]);
                if (typeof rows[0] != 'undefined') {
                    connection.query("SELECT * FROM emails order by date desc", function(err, rows, fields) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.json(rows);
                        }
                    });
                }
            }
        });
    }
});



app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    //throw err;
    res.send(err);
});