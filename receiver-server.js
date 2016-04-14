var mailin = require('mailin');
var connection = require('./libs/dbconnection');


mailin.start({
    port: 25000,
    disableWebhook: true // Disable the webhook posting.
});


/* Event emitted after a message was received and parsed. */
mailin.on('message', function(conn, data, content) {
    console.log(data);
    connection.query("SELECT * FROM users WHERE email = '" + data.envelopeTo[0].address + "'", function(err, rows, fields) {
        if (err) {
            console.log(err);
        } else {
            if (typeof rows[0] != 'undefined') {
                
                
                StringDecoder = require('string_decoder').StringDecoder;
                decoder = new StringDecoder('utf8');
                var att = data.attachments;
                var str = [];
                att.forEach(function(at){
                    //var dec = decoder.write(at.content);
                    dec = at.content.toString('base64');
                    console.log(dec);
                    at.content = '';
                    var cd = {};
                    cd = at;
                    cd.content = dec;
                    str.push(cd);
                });
                
                if(rows[0].redirect != 'undefined' && rows[0].redirect != 'null' && typeof rows[0].redirect != null){
                    data.envelopeTo[0].address = rows[0].redirect;
                }
                
                connection.query("INSERT INTO emails (_from, _to, body, subject, attachment) VALUES ('" + data.envelopeFrom.address + "', '" + data.envelopeTo[0].address + "', '" + encodeURIComponent(data.html) + "', '" + data.subject + "', '" + JSON.stringify(str) + "')", function(err, rows, fields) {
                    if (err) {
                        console.log(err);
                    } else {
                        connection.query("ALTER TABLE emails ORDER BY date DESC", function(err, rows, fields) {});
                        console.log('NEW MESSAGE');
                    }
                });
            }
        }
    });
});
