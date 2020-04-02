'use strict'

var config = require('../config');
var sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(config.sendgridKey);

exports.send = async (to, subject, body) => {
    const msg = {
        to: to,
        from: 'henriquemello57@gmail.com',
        subject: subject,
        html: body
    };
    sendgrid.send(msg);
}