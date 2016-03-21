var mailin = require('mailin');

mailin.start({
    port: 25,
    disableWebhook: true // Disable the webhook posting.
});



/* Event emitted after a message was received and parsed. */
mailin.on('message', function(connection, data, content) {
    console.log('from: ' + data.from);
    console.log('to: ' + data.to);
    console.log('/n/n/n:::::::::::::   message');
    console.log(content);
});