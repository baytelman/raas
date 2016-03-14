var format = require("string-template")
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var projectsDao = require("../dao/projects");

var fs = require('fs');

var transporter = null;
if (config.email.service) {

    transporter = nodemailer.createTransport(smtpTransport({
        service: config.email.service,
        auth: {
            user: config.email.username,
            pass: config.email.pass
        }
    }));
}

var emailWelcomeString = fs.readFileSync('resources/templates/new_project_email.txt', 'utf-8');
var introString = fs.readFileSync('resources/templates/intro.txt', 'utf-8');

module.exports = {

    createNewProjectAndSendToken: function(email, callback) {
        projectsDao.insertNewProject(function(projectId) {

            projectsDao.updateProjectDescription(projectId, {
                email: email
            }, function() {
                projectsDao.getAccessTokenForProject(projectId, function (accessToken) {

                    if (transporter) {
                        var params = {
                            message: 'project added: ' + projectId,
                            project_id: projectId,
                            access_token: accessToken
                        };

                        var subject = "Welcome to RAASTA ✔";
                        if (config.env != 'prod') {
                            subject += " (" + config.env + ")";
                        }

                        var body = format(emailWelcomeString + introString, params);

                        transporter.sendMail({
                            from: config.email.username,
                            to: email,
                            subject: subject,
                            text: body
                        }, function (error, response) {
                            if (error) {
                                console.error(error);
                            } else {
                                console.info("Message sent to " + email);
                            }
                        });
                    }

                    callback(projectId, email);
                });
            });
        });
    },
};