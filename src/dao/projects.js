"use strict";

var config = require('../config.js');
var pg = require('pg');


module.exports = {
    insertNewProject: function(newProjectCallback) {
        pg.connect(config.db.url, function(err, client, done) {
            if (err) throw err;

            client.query('INSERT INTO projects (id) VALUES (DEFAULT) RETURNING id',
                function(err, result) {
                    done();
                    if (err) throw err;

                    var projectId = result.rows[0].id;
                    console.info("Project inserted:" + projectId);
                    newProjectCallback(projectId);
                });
        });
    },
    getAccessTokenForProject: function(projectId, accessTokenCallback) {
        pg.connect(config.db.url, function(err, client, done) {
            if (err) throw err;

            client.query('INSERT INTO tokens (project_id) VALUES ($1) RETURNING access_token',
                [projectId],
                function(err, result) {
                    done();
                    if (err) throw err;

                    var token = result.rows[0].access_token;
                    console.info("Token inserted:" + token);
                    accessTokenCallback(token);
                });
        });
    },
    getProjectDescription: function(projectId, projectCallback) {
        pg.connect(config.db.url, function(err, client, done) {
            if (err) throw err;

            client.query('SELECT * FROM ' +
                '   project_descriptions ' +
                'WHERE ' +
                '   project_id = $1 ' +
                'ORDER BY ' +
                '   timestamp DESC ' +
                'LIMIT 1',
                [projectId],
                function(err, result) {
                    done();
                    if (err) throw err;

                    projectCallback(result.rows[0]);
                });
        });
    },
    updateProjectDescription: function(projectId, newValues, insertCallback) {
        this.getProjectDescription(projectId, function(project) {

            if (!project) {
                project = {
                    name: 'New Project'
                };
            }
            for (var key in newValues) {
                project[key] = newValues[key];
            }
            project['timestamp'] = undefined;
            project['project_id'] = projectId;

            const DESCRIPTION_INSERT = 'INSERT ' +
                'INTO project_descriptions ' +
                '   (project_id, name, email, key_1, key_2, key_3) ' +
                'VALUES ' +
                '   ($1, $2, $3, $4, $5, $6) ' +
                'RETURNING project_id';

            pg.connect(config.db.url, function(err, client, done) {
                if (err) throw err;

                client.query(DESCRIPTION_INSERT,
                    [project['project_id'],
                        project['name'],
                        project['email'],
                        project['key_1'],
                        project['key_2'],
                        project['key_3']],
                    function(err, result) {
                        done();
                        if (err) throw err;

                        insertCallback(result.rows[0].project_id);
                    });
            });
        });
    },
};
