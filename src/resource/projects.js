"use strict";

var projectsLogic = require('../logic/projects.js');

module.exports = {
    version: function(req, res) {
        console.track('api-version');
        projectsLogic.getVersion(function(version) {
            res.send(version);
        });
    },
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