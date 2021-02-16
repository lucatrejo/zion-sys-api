const knex = require('../../db');
const logger = require('../../logger');

const TABLE_NAME = 'customers';
const TABLE_NAME_ACCOUNT = 'accounts';
const TABLE_NAME_DETAIL_ACCOUNT = 'accounts_detail';

async function insert({ name, last_name, identification, birthdate, address }) {
  const columnInfo = await knex(TABLE_NAME).columnInfo();
  const columns = Object.keys(columnInfo);

  const [customer] = await knex(TABLE_NAME)
    .insert({
      name,
      last_name,
      identification,
      birthdate,
      address,
    })
    .returning(columns);
  return customer;
}

async function update({ id, name, last_name, identification, birthdate, address }) {
  const columnInfo = await knex(TABLE_NAME).columnInfo();
  const columns = Object.keys(columnInfo);

  const [customer] = await knex(TABLE_NAME)
    .where({ id })
    .update({
      name,
      last_name,
      identification,
      birthdate,
      address,
      updated_at: new Date(),
    })
    .returning(columns);
  return customer;
}

async function getById(id) {
  const [customer] = await knex(TABLE_NAME)
    .select()
    .where(id)
    .limit(1);
  return customer;
}

async function getAll() {
  const customer = await knex('customers')
    .join('accounts', 'accounts.customer_id', 'customers.id')
    .select(
      knex.raw(
        "customers.id, customers.name, customers.last_name, customers.identification, to_char(customers.birthdate,'DD/MM/YYYY') as birthdate, customers.address, to_char(accounts.first_debt_date,'DD/MM/YYYY') as first_debt_date"
      )
    )
    .where('enable', '=', true);
  return customer;
}

async function getCustomerWithName(name) {
  const items = await knex(TABLE_NAME)
    .select(
      knex.raw(
        "id, name, last_name, identification, to_char(birthdate,'DD/MM/YYYY') as birthdate, address"
      )
    )
    .where('name', 'ilike', `%${name}%`)
    .where('enable', '=', true);
  return items;
}

async function deleteById(id) {
  const columnInfo = await knex(TABLE_NAME).columnInfo();
  const columns = Object.keys(columnInfo);

  const [customer] = await knex(TABLE_NAME)
    .where({ id })
    .update({
      enable: false,
      updated_at: new Date(),
    })
    .returning(columns);
  return customer;
}
async function getAccount(customerId) {
  const [customer] = await knex(TABLE_NAME_ACCOUNT)
    .select()
    .where('customer_id', customerId)
    .limit(1);
  return customer;
}

async function getDetailAccount(accountId) {
  const customer = await knex(TABLE_NAME_DETAIL_ACCOUNT)
    .select(
      knex.raw(
        "sale_id, to_char(created_at,'DD/MM/YYYY') as date, status"
      )
    )
    .where('account_id', accountId);
  return customer;
}
async function getDetailAccountById(id) {
  const [customer] = await knex(TABLE_NAME_DETAIL_ACCOUNT)
    .select()
    .where(id)
    .limit(1);
  return customer;
}

async function updateAccount(id, amount) {
  let accountId = 0;
  let totalAmount;
  if (amount !== 0) {
    const account = await knex(TABLE_NAME_ACCOUNT)
      .select('status', 'amount')
      .where(id);
    totalAmount = account[0].amount - amount;
    accountId = await knex(TABLE_NAME_ACCOUNT)
      .where(id)
      .update({
        amount: totalAmount,
      })
      .returning(['id']);
  } else {
    accountId = await knex(TABLE_NAME_ACCOUNT)
      .where(id)
      .update({
        amount,
        status: 'up_to_date',
        first_debt_date: null,
      })
      .returning(['id']);
  }
  return accountId;
}
async function updateAccountDetail(accountId, status) {
  await knex(TABLE_NAME_DETAIL_ACCOUNT)
    .where('account_id', accountId)
    .update({
      status,
    });
}
async function updateAccountDetailById(id, status) {
  await knex(TABLE_NAME_DETAIL_ACCOUNT)
    .where(id)
    .update({
      status,
    });
}

module.exports = {
  insert,
  update,
  getById,
  getAll,
  getCustomerWithName,
  deleteById,
  getAccount,
  getDetailAccount,
  updateAccount,
  updateAccountDetail,
  getDetailAccountById,
  updateAccountDetailById,
};
