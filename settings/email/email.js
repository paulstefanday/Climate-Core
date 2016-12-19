'use strict'

const nodemailer = require("nodemailer")
const Handlebars = require('handlebars')
const jade = require('jade')
const smtpTransport = require('nodemailer-smtp-transport')
const sesTransport = require('nodemailer-ses-transport')

module.exports = {
    send: function *(options) {
        var transporter, template, header, smtp, html
        transporter = nodemailer.createTransport(sesTransport({
          accessKeyId: process.env.S3_KEY,
          secretAccessKey: process.env.S3_SECRET,
          region: 'us-west-2',
          rateLimit: 14
        }));

        html = yield this.render(options);
        header = {
            to: options.to, html,
            from: ( options.fromName || 'Climate Tracker' ) + '<' + ( options.fromEmail || process.env.EMAIL ) + '>',
            subject: options.subject || 'Climate Tracker Notification',
            // bcc: process.env.ADMIN
        }

        smtp = new Promise((resolve, reject) => {
            // Send fake response if running tests so your tests don't spam people
            if(process.env.NODE_ENV === 'test') return resolve({ fake: 'data'});
            // Otherwise send real email

            transporter.sendMail(header, (err, info) => {
                if(err) console.log(err)
               resolve(info || {});
            });
        });

        return smtp;
    },

    sendHtmlWithError: function *(options) {
        var transporter, template, header, smtp, html
        transporter = nodemailer.createTransport(sesTransport({
          accessKeyId: process.env.S3_KEY,
          secretAccessKey: process.env.S3_SECRET,
          region: 'us-west-2',
          rateLimit: 14
        }));

        html = this.html(options);
        header = {
            to: options.to, html,
            from: ( options.fromName || 'Climate Tracker' ) + '<' + ( options.fromEmail || process.env.EMAIL ) + '>',
            subject: options.subject || 'Climate Tracker Notification',
            // bcc: process.env.ADMIN
        }

        smtp = new Promise((resolve, reject) => {
            // Send fake response if running tests so your tests don't spam people
            if(process.env.NODE_ENV === 'test') return resolve({ fake: 'data'});
            // Otherwise send real email

            transporter.sendMail(header, (err, info) => {
                if(err) reject(err)
               resolve(info || {});
            });
        });

        return smtp;
    },

    render: function *(data) {
        // if has data.template then it's a jade url
        if (data.template) return yield this.jade(data)

        // if it has data.html then it needs handlebars becasue it's an html string
        return this.html(data)
    },
    html: (data) => {
      let pre = "<html><head></head><body>"
      let post = "</body></html>"
      var template = Handlebars.compile(pre + data.html + post)
      return template(data)
    },
    jade: function *(data) {
        var path = __base + 'api/settings/email/templates/',
            template = data.template + '.jade' || 'test.jade';

        var render = new Promise((resolve, reject) => {
            jade.renderFile(path + template, data, (err, file) => {
                if(err) reject(err);
                resolve(file)
            });
        });

        return render;
    }
}
