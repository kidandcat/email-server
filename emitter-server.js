var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var nodemailer = require('nodemailer');


var smtpConfig = {
    host: 'galax.be',
    port: 465,
    secure: false, // use SSL
    auth: {
        user: 'user@galax.be',
        pass: 'pass'
    }
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



app.get('/emails/:user/:token', function(req, res, next){
    
});



app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    //throw err;
    res.send(err);
});



var mailOptions = {
    from: '"Fred Foo 👥" <foo@galax.be>', // sender address
    to: 'kidandcat@gmail.com, baz@galax.be', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world 🐴', // plaintext body
    html: '<b>Hello world 🐴</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});