
exports.up = function (knex) {
    return knex.schema.createTable('accounts', function (t) {
        t.increments('user_id')
        t.string('username', 50).notNullable()
        t.string('password', 200).notNullable()
        t.string('email', 355).notNullable()
        t.timestamp('created_on').notNullable().defaultTo(knex.fn.now())
        t.timestamp('last_login')
        t.integer('profile_id')

        t.unique('username')
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('accounts')
};
