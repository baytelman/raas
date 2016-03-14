"use strict";

var config = require('../config.js');
var projectsLogic = require('../logic/projects.js');

module.exports = {
    insert: function(req, res) {
        var email = req.query.email;
        projectsLogic.createNewProjectAndSendToken(email, function(projectId, email) {
            res.send({
                message: 'project added: ' + projectId,
                project_id: projectId,
                email: email,
            });
        });
    },
};