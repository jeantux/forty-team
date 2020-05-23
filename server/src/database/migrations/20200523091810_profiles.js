
exports.up = function (knex) {
    return knex.schema.createTable('profiles', function (t) {
        t.increments('profile_id')
        t.string('full_name', 100)
        t.string('phone', 15)
        t.string('description', 100)
        t.string('image', 600)
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('profiles')
};
