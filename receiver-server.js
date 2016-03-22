var mailin = require('mailin');
var connection = require('./libs/dbconnection');

mailin.start({
    port: 25,
    disableWebhook: true // Disable the webhook posting.
});


/* Event emitted after a message was received and parsed. */
mailin.on('message', function(conn, data, content) {
    console.log(data.envelopeFrom.address + "', '" + data.envelopeTo[0].address);
    connection.query("INSERT INTO emails (_from, _to, _body) VALUES ('" + data.envelopeFrom.address + "', '" + data.envelopeTo[0].address + "', '" + encodeURIComponent(data.html) + "')", function(err, rows, fields) {
        if(err){
            console.log(err);
        }else{
            console.log('NEW MESSAGE');
        }
    });
});
