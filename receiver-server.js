var mailin = require('mailin');
var connection = require('./libs/dbconnection');

mailin.start({
    port: 25,
    disableWebhook: true // Disable the webhook posting.
});


/* Event emitted after a message was received and parsed. */
mailin.on('message', function(conn, data, content) {
    connection.query("INSERT INTO emails VALUES (null, '" + data.from.address + "', '" + data.to.address + "', '" + data.html + "')", function(err, rows, fields) {
        if(err){
            console.log(err);
        }
    });
});



/* Event emitted when a connection with the Mailin smtp server is initiated. */
mailin.on('startMessage', function (connection) {
  /* connection = {
      from: 'sender@somedomain.com',
      to: 'someaddress@yourdomain.com',
      id: 't84h5ugf',
      authentication: { username: null, authenticated: false, status: 'NORMAL' }
    }
  }; */
  console.log('::::::::: startMessage');
  console.log(connection);
});


/* Access simplesmtp server instance. */
mailin.on('authorizeUser', function(connection, username, password, done) {
  console.log('::::::::: authorizeUser');
});