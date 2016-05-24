var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
// create reusable transport method (opens pool of SMTP connections)
function createTransport(){
  "use strict";
  var transporter = nodemailer.createTransport(smtpTransport({
        service: "Gmail",
        auth: {
          user : "sparksender2016@gmail.com",
          pass : "Spark##123"
        }
      })
  );
  return transporter;
}

function sendMail(receiver,subject,content,callback) {
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: "admin@twitter.com", // sender address
    to: receiver,
    subject: subject,
    text: "",
    html: content
  };

  //create reusable transport method
  var transporter = createTransport();

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(err, response){
    if(err){ console.log("ERROR: fail to send email"); }

    callback(err, response);

    // if you don't want to use this transport object anymore, uncomment following line
    transporter.close(); // shut down the connection pool, no more messages
  });
}


module.exports.sendMail = sendMail;