var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var mysql = require('mysql');
var Email = require('email').Email;



var app = express();

var httpServer = http.createServer(app);



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());



/*app.get('/emails/:user/:token', function(req, res, next) {

});*/

/* from, to, subject, text, html */
app.post('/email/new/', function(req, res, next) {
    console.log('body');
    console.log(IsJsonString(req.body));
    console.log(req.body);
    sendMail(req.body);
    res.send('ok');
});



app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    throw err;
    //res.send(err);
});



function sendMail(options/* from, to, subject, body */) {
    options.bodyType = 'html';
    var myMsg = new Email(options);
    
    myMsg.send(function(err){
        console.log(err);    
        options.body = err;
        options.to = options.from;
        options.from = 'admin@galax.be';
        var errMsg = new Email(options);
        errMsg.send(function(err){
            if(err){
                console.log(err);
            }
        });
    });
}


function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


httpServer.listen(8010, '127.0.0.1');
console.log('server listening in 127.0.0.1:8010');
//httpsServer.listen(443);