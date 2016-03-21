var mailin = require('mailin');
var connection = require('./libs/dbconnection');

mailin.start({
    port: 25,
    disableWebhook: true // Disable the webhook posting.
});


/* Event emitted after a message was received and parsed. */
mailin.on('message', function(connection, data, content) {
    connection.query("INSERT INTO emails VALUES (null, '" + data.from + "', '" + data.to + "', '" + data.html + "')", function(err, rows, fields) {
        
    });
});