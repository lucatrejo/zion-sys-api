exports.up = async function up(knex) {
  await knex.schema.createTable('sales', table => {
    table
      .increments('id')
      .unsigned()
      .notNullable()
      .primary(['sale_job_pkey']);
      table.integer('employee_id').unsigned().notNullable();
      table.integer('customer_id').unsigned().notNullable();
      table.date('date').notNullable().defaultTo(knex.fn.now());
    table.boolean('enable')
      .notNullable()
      .defaultTo(true);
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.fn.now());

    table.foreign('employee_id').references('id').inTable('employees');
    table.foreign('customer_id').references('id').inTable('customers');
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTable('sales');
};
