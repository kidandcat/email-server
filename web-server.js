var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var connection = require('./libs/dbconnection');
var querystring = require('querystring');


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





app.post('/new/:token', function(req, res) {
    auth(req.params.token,function(user){
        if(user == "no user found"){
            res.send('not authorized');
            return false;
        }
        req.body.from = user + '@galax.be';
        var data = querystring.stringify(req.body);

        var options = {
            host: '127.0.0.1',
            port: 8010,
            path: '/email/new',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data)
            }
        };
            
        if(req.body.to.split('@')[1] == 'galax.be'){
            connection.query("SELECT * FROM users WHERE nick = '" + req.body.to.split('@')[0] + "'", function(err, rows, fields) {
                if (err) {
                    console.log(err);
                } else {
                    if (typeof rows[0] != 'undefined') {
                        connection.query("INSERT INTO emails (_from, _to, _body) VALUES ('" + req.body.from + "', '" + req.body.to + "', '" + encodeURIComponent(req.body.body) + "')", function(err, rows, fields) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('NEW MESSAGE');
                            }
                        });
                    }
                }
            });
        }else{
            var req = http.request(options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function(chunk) {
                    console.log("body: " + chunk);
                });
            });

            req.write(data);
            req.end();
        }
        
        res.send('ok');
    });
});

app.get('/login/:user/:password', function(req, res) {
    connection.query("SELECT * FROM users WHERE nick = '" + req.params.user + "' AND password = '" + req.params.password + "'", function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            if (typeof rows[0] != 'undefined') {
                console.log('generating token');
                var token = genToken();
                connection.query("UPDATE users SET token='" + token + "' WHERE nick='" + req.params.user + "'", function(err, rows, fields) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send({ token: token, auth: true });
                    }
                });
            } else {
                res.send('not authorized');
            }
        }
    });
});

app.get('/mails/:token', function(req, res) {
    auth(req.params.token,function(user){
        if(user == "no user found"){
            res.send('not authorized');
            return false;
        }
        connection.query("SELECT * FROM emails WHERE _to = '" + user + "@galax.be' order by date desc", function(err, rows, fields) {
            if (err) {
                console.log(err);
                res.send('error');
            } else {
                res.json(rows);
            }
        });
    });
});



app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    //throw err;
    res.send(err);
});


function genToken() {
    return Math.floor(Math.random() * 100000000);
}

function auth(token, cb) {
    /*
    var user = auth(req.params.token);
    if(user == "no user found"){
        res.send('not authorized');
        return false;
    }
    */
    connection.query("SELECT * FROM users WHERE token = '" + token + "'", function(err, rows, fields) {
        if (err) {
            console.log(err);
            cb("no user found");
        } else {
            if (typeof rows[0] != 'undefined') {
                cb(rows[0].nick);
            }else{
                cb("no user found");
            }
        }
    });
}