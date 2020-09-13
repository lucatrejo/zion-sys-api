const knex = require('../../db');
const logger = require('../../logger');

const TABLE_NAME = 'purchases';
const TABLE_NAME_DETAIL = 'purchases_detail';

async function insert({ employee_id, provider_id, date }) {
  const columnInfo = await knex(TABLE_NAME).columnInfo();
  const columns = Object.keys(columnInfo);

  const [purchase] = await knex(TABLE_NAME)
  .insert({
    employee_id: employee_id,
    provider_id: provider_id,
    date: date
  })
  .returning(columns);
  return purchase;
}

async function insertDetail(purchase_id, item_id, unit_price, quantity) {
  const columnInfo = await knex(TABLE_NAME_DETAIL).columnInfo();
  const columns = Object.keys(columnInfo);

  const [purchase_detail] = await knex(TABLE_NAME_DETAIL)
  .insert({
    purchase_id: purchase_id,
    item_id: item_id,
    unit_price: unit_price,
    quantity: quantity,
  })
  .returning(columns);
  return purchase_detail;
}

async function updateStock(item_id, quantity) {
  await knex('items')
    .where('id', item_id)
    .update({
      stock: knex.raw('?? + ' + quantity, ['stock'])
    })
}

async function update({ id, employee_id, provider_id }) {
  const columnInfo = await knex(TABLE_NAME).columnInfo();
  const columns = Object.keys(columnInfo);

  const [purchase] = await knex(TABLE_NAME)
    .where({id})
    .update({
      employee_id: employee_id,
      provider_id: provider_id,
      updated_at: new Date(),
    })
    .returning(columns);
  return purchase;
}

async function updateDetail({ id, purchase_id, item_id, unit_price, quantity }) {
  const columnInfo = await knex(TABLE_NAME_DETAIL).columnInfo();
  const columns = Object.keys(columnInfo);

  const [purchase] = await knex(TABLE_NAME)
    .where({id})
    .update({
      purchase_id: purchase_id,
      item_id: item_id,
      unit_price: unit_price,
      quantity: quantity,
      updated_at: new Date(),
    })
    .returning(columns);
  return purchase;
}

async function getById(id) {
  const [provider] = await knex(TABLE_NAME)
    .select(knex.raw('id, employee_id, provider_id, to_char(date, \'DD/MM/YYYY\') as date'))
    .where(id)
    .limit(1);
  return provider;
}

async function getAll() {
  const purchases = await knex(TABLE_NAME)
    .join('employees', 'purchases.employee_id', 'employees.id')
    .join('providers', 'purchases.provider_id', 'providers.id')
    .select(knex.raw('purchases.id, employees.name as employee_name, employees.last_name as employee_last_name, providers.name as provider, to_char(purchases.date, \'DD/MM/YYYY\') as date'));
  return purchases;
}

async function getAllMonth() {
  const purchases = await knex(TABLE_NAME)
    .join('employees', 'purchases.employee_id', 'employees.id')
    .join('providers', 'purchases.provider_id', 'providers.id')
    .whereRaw('EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM NOW())')
    .select(knex.raw('purchases.id, employees.name as employee_name, employees.last_name as employee_last_name, providers.name as provider, to_char(purchases.date, \'DD/MM/YYYY\') as date'));
  return purchases;
}

async function getAllOrderByEmployee() {
  const purchases = await knex(TABLE_NAME)
    .join('employees', 'purchases.employee_id', 'employees.id')
    .join('providers', 'purchases.provider_id', 'providers.id')
    .whereRaw('EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM NOW())')
    .orderBy('employees.last_name', 'desc')
    .select(knex.raw('purchases.id, employees.name as employee_name, employees.last_name as employee_last_name, providers.name as provider, to_char(purchases.date, \'DD/MM/YYYY\') as date'));
  return purchases;
}

async function getDetailById(id) {
  const details = await knex('purchases_detail')
    .join('items', 'purchases_detail.item_id', 'items.id')
    .where({purchase_id: id})
    .select(['purchases_detail.id', 'items.name', 'purchases_detail.unit_price', 'purchases_detail.quantity']);

    return details;
}

async function getTopItemsDb() {
  const topItems = await knex('purchases_detail')
    .join('items', 'purchases_detail.item_id', 'items.id')
    .select('purchases_detail.item_id', 'items.code', 'items.name', knex.raw('COUNT(*)'))
    .groupByRaw('purchases_detail.item_id, items.code, items.name');
  return topItems;
}

async function getItemsCriticalStockDb() {
  const topItems = await knex('items')
    .select('id', 'code', 'name', 'stock', 'critical_stock')
    .whereRaw('stock between 0 and critical_stock');
  return topItems;
}

module.exports = {
  insert,
  insertDetail,
  update,
  getById,
  getAll,
  getDetailById,
  getTopItemsDb,
  getItemsCriticalStockDb,
  getAllMonth,
  getAllOrderByEmployee,
  updateStock
};
