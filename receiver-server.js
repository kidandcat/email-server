var mailin = require('mailin');
var connection = require('./libs/dbconnection');

mailin.start({
    port: 25000,
    disableWebhook: true // Disable the webhook posting.
});


/* Event emitted after a message was received and parsed. */
mailin.on('message', function(conn, data, content) {
    console.log(data);
    connection.query("SELECT * FROM users WHERE nick = '" + data.envelopeTo[0].address.split('@')[0] + "'", function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            if (typeof rows[0] != 'undefined') {
                connection.query("INSERT INTO emails (_from, _to, _body) VALUES ('" + data.envelopeFrom.address + "', '" + data.envelopeTo[0].address + "', '" + encodeURIComponent(data.html) + "')", function(err, rows, fields) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('NEW MESSAGE');
                    }
                });
            }
        }
    });
});
