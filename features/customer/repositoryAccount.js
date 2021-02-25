const knex = require('../../db');
const logger = require('../../logger');

const TABLE_NAME = 'accounts';

async function insertAccount(customerId) {
  const columnInfo = await knex(TABLE_NAME).columnInfo();
  const columns = Object.keys(columnInfo);

  const [customer] = await knex(TABLE_NAME)
  .insert({
    customer_id: customerId,
    amount: 0.0,
    status: "up_to_date",
  })
  .returning(columns);
  return customer;
}

module.exports = {
  insertAccount,
};
