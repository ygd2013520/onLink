var amqp = require('amqplib/callback_api');
var guid = require('guid');
var config = require('../config');

var amqpCh;
var ex = 'service';
var replyQueue = 'serviceReplyQueue'; //will be assigned to random string later
var cbMap = {};

//TODO: handle error case;
function init(callback) {
  if(amqpCh) {
    if(callback)callback();
  } else {
    amqp.connect(config.ampq.uri, function(err,conn) {
      if(err)console.log(err);
      else {
        console.log("Connected to rabbitMQ: " + config.ampq.uri);
      }
      conn.createChannel(function(err,ch){
        amqpCh = ch;
        //request exchange: can have multiple queue
        amqpCh.assertExchange(ex, 'topic', {durable: true});

        //response queue: only one queue
        ch.assertQueue('', {exclusive: true}, function(err, q) {
          replyQueue = q.queue;
          amqpCh.consume(replyQueue, function(msg) {
            var correlationId = msg.properties.correlationId;
            if (correlationId in cbMap) {
              var res = JSON.parse(msg.content);
              var entry = cbMap[correlationId];

              clearTimeout(entry.timeout);

              entry.callback(res);
              delete cbMap[correlationId];
            }
            amqpCh.ack(msg); //silently drop if not match, could be duplicate due to server reboot
          });
          if(callback)callback();
        });
      });
    });
  }
}

function makeRequest(key, req, callback) {
  var correlationId = guid.raw();

  var tId = setTimeout(function(corr_id){
    callback(new Error("Timeout waiting for rpc response: " + "key:"  + key + " correlation id:" + corr_id));
    delete cbMap[corr_id];
  }, config.ampq.REQ_TIMEOUT, correlationId);

  var entry = {
    callback:callback,
    timeout: tId //the id for the timeout so we can clear it later
  };
  cbMap[correlationId] = entry;
  amqpCh.publish(ex,
      key,
      new Buffer(JSON.stringify(trimReq(req))),
      {
        persistent: true,
        content_type: 'application/json',
        replyTo: replyQueue,
        correlationId: correlationId
      }
  );
}

function trimReq(req) {
  var reqTrim = {};
  reqTrim.body = req.body;
  return reqTrim;
}

module.exports.init = init;
module.exports.makeRequest = makeRequest;
module.exports.amqpCh = amqpCh;