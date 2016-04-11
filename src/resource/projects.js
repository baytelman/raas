"use strict";

var config = require('../config.js');
var projectsLogic = require('../logic/projects.js');

module.exports = {
    version: function(req, res) {
        console.track('api-version');
        git.short(function (hash) {
            res.send({
                commit: hash
            });
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