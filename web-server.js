var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var connection = require('./libs/dbconnection');
var request = require('request');



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



app.post('/new', function(req, res) {
    request.post('http://127.0.0.1:8010/email/new', { form: req.body }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            res.send('ok');
        } else {
            console.log('err');
            console.log(body);
            res.send('ko');
        }
    });
});

app.get('/login/:user/:password', function(req, res) {
    if (req.params.user != 'admin') {
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
                } else {
                    res.send('not authorized');
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
                } else {
                    res.json({ 0: ['not authorized'] });
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