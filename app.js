var mailin = require('mailin');
var connection = require('./libs/dbconnection');

mailin.start({
    port: 25,
    disableWebhook: true // Disable the webhook posting.
});


/* Event emitted after a message was received and parsed. */
mailin.on('message', function(conn, data, content) {
    connection.query("INSERT INTO emails VALUES (null, '" + data.from.address + "', '" + data.to.address + "', '" + data.html + "')", function(err, rows, fields) {
        
    });
});