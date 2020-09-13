exports.up = async function up(knex) {
  await knex.schema.createTable('employees', table => {
    table
      .increments('id')
      .unsigned()
      .notNullable()
      .primary(['employee_job_pkey']);
    table.string('name', 55).notNullable();
    table.string('cuil', 55).notNullable();
    table.date('admission_date')
      .notNullable()
      .defaultTo(knex.fn.now());
    table.string('last_name', 55).notNullable();
    table.string('identification', 30).notNullable();
    table.date('birthdate');
    table.string('address', 55);
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.fn.now());

    table.unique('identification');
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTable('employees');
};
