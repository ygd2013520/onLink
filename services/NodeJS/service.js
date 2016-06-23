var amqp = require('amqplib/callback_api');
var system = require('./system/osi');
var basename = require('path').basename;

listenKeys = ['storage'];
ex = 'service';

console.log("tttt");
var data = system.run_command('ls');
console.log(data);

function bail(err, conn) {
  console.error(err);
  if (conn) conn.close(function () {
    process.exit(1);
  });
}

function on_connect(err, conn) {
  if (err !== null) return bail(err);
  process.once('SIGINT', function () {
    conn.close();
  });

  conn.createChannel(function (err, ch) {
    if (err !== null) return bail(err, conn);
    var exopts = {durable: true};

    ch.assertExchange(ex, 'topic', exopts);
    ch.assertQueue('', {exclusive: true}, function (err, ok) {
      if (err !== null) return bail(err, conn);

      var queue = ok.queue, i = 0;

      function sub(err) {
        if (err !== null) return bail(err, conn);
        else if (i < listenKeys.length) {
          ch.bindQueue(queue, ex, listenKeys[i], {}, sub);
          i++;
        }
      }

      ch.consume(queue, reply, {noAck: false}, function (err) {
        if (err !== null) return bail(err, conn);
        console.log('[x] Awaiting RPC requests.');
        sub(null);
      });

      function reply(msg) {
        console.log('start');
        var dict = {
          "status": 20,
          "content": 'test reply'
        };
        console.log(dict);
        ch.sendToQueue(msg.properties.replyTo,
          new Buffer(JSON.stringify(dict)),
          {correlationId: msg.properties.correlationId});
        ch.ack(msg);
        console.log('end');
      }
    });
  });
}

amqp.connect('amqp://localhost', on_connect);