var mailin = require('mailin');

mailin.start({
    port: 25,
    disableWebhook: true // Disable the webhook posting.
});



/* Event emitted after a message was received and parsed. */
mailin.on('message', function(connection, data, content) {
    console.log('from: ');
    console.log(data.from);
    console.log('to: ');
    console.log(data.to);
    console.log(':::::::::::::   message');
    console.log(data.html);
});