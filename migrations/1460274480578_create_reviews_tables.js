exports.up = function(pgm) {
    pgm.createTable('reviews', {
        id: { type: 'bigserial', primaryKey: true },
        project_id: { type: 'uuid', notNull: true, references: 'projects' },
        user_id: { type: 'varchar(255)', notNull: true },
        key1: { type: 'varchar(255)' },
        key2: { type: 'varchar(255)' },
        key3: { type: 'varchar(255)' },
        title: { type: 'text', notNull: true },
        body: { type: 'text', notNull: true },
        timestamp: { type: 'Timestamp Without Time Zone', notNull: true , default: 'now' }
    });

    pgm.createIndex('reviews', ['project_id']);
    pgm.createIndex('reviews', ['key1']);
    pgm.createIndex('reviews', ['key2']);
    pgm.createIndex('reviews', ['key3']);
    pgm.createIndex('reviews', ['user_id']);
    pgm.createIndex('reviews', ['timestamp']);

    pgm.renameTable('project_descriptions', 'project_description_log');
};

exports.down = function(pgm) {
    pgm.renameTable('project_description_log', 'project_descriptions');
    pgm.dropTable("reviews");
};
