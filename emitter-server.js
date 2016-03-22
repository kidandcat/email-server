var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var mysql = require('mysql');
var nodemailer = require('nodemailer');


var smtpConfig = {
    host: 'galax.be',
    port: 25,
    secure: false, // use SSL
    ignoreTLS: true
};
var transporter = nodemailer.createTransport(smtpConfig);

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

httpServer.listen(8001);
//httpsServer.listen(443);

module.exports = httpServer;


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



app.get('/emails/:user/:token', function(req, res, next) {
    
});

/* from, to, subject, text, html */
app.post('/email/new/',function(req, res ,next){
    sendEmail(req.body);
});



app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    //throw err;
    res.send(err);
});



function sendMail(options/* from, to, subject, text, html */) {
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}