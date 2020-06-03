
exports.up = function(knex) {
    return knex.schema.table('profiles', function (t) {
        t.string('email', 100)
    })
};

exports.down = function(knex) {
    return knex.schema.table('profiles', function (t) {
        t.dropColumn('email')
    })
};
