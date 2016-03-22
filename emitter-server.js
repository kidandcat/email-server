var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var mysql = require('mysql');
var Email = require('email').Email;






//var https = require('https');
//var privateKey = fs.readFileSync('/etc/letsencrypt/live/galax.be/privkey.pem', 'utf8');
//var certificate = fs.readFileSync('/etc/letsencrypt/live/galax.be/cert.pem', 'utf8');
//var credentials = {key: privateKey, cert: certificate};

var app = express();

var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);

//redirect http to https
/*app.use(function(req, res, next) {
  if (req.protocol != 'https') {
    res.redirect(301, "https://" + req.headers["host"] + req.url);
  } else {
    next();
  } 
});*/

httpServer.listen(10000);
//httpsServer.listen(443);

module.exports = httpServer;


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



app.get('/emails/:user/:token', function(req, res, next) {

});

/* from, to, subject, text, html */
app.post('/email/new/', function(req, res, next) {
    req.body.envelope = {
        from: req.body.from,
        to: req.body.to
    }
    console.log(req.body.envelope);
    sendMail(req.body);
    res.send('ok');
});



app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    throw err;
    //res.send(err);
});



function sendMail(options/* from, to, subject, text, html */) {
    var myMsg = new Email(options);
    
    myMsg.send(function(err){
        console.log(err);    
    });
}
