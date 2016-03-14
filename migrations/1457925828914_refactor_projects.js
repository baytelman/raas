exports.up = function(pgm) {
    pgm.renameTable('products', 'projects');
    pgm.renameTable('product_descriptions', 'project_descriptions');
    pgm.renameColumn('project_descriptions', 'product_id', 'project_id');
    pgm.renameColumn('ratings', 'product_id', 'project_id');
    pgm.renameColumn('tokens', 'product_id', 'project_id');
};

exports.down = function(pgm) {
    pgm.renameTable('projects', 'products');
    pgm.renameTable('project_descriptions', 'product_descriptions');
    pgm.renameColumn('product_descriptions', 'project_id', 'product_id');
    pgm.renameColumn('ratings', 'project_id', 'product_id');
    pgm.renameColumn('tokens', 'project_id', 'product_id');

};
