const knex = require('../../db');

const TABLE_NAME = 'sales';
const TABLE_NAME_DETAIL = 'sales_detail';

async function insert({ employee_id, customer_id, date }) {
  const columnInfo = await knex(TABLE_NAME).columnInfo();
  const columns = Object.keys(columnInfo);

  const [sale] = await knex(TABLE_NAME)
  .insert({
    employee_id: employee_id,
    customer_id: customer_id,
    date: date
  })
  .returning(columns);
  return sale;
}

async function insertDetail(sale_id, item_id, unit_price, quantity) {
  const columnInfo = await knex(TABLE_NAME_DETAIL).columnInfo();
  const columns = Object.keys(columnInfo);

  const [sale_detail] = await knex(TABLE_NAME_DETAIL)
  .insert({
    sale_id: sale_id,
    item_id: item_id,
    unit_price: unit_price,
    quantity: quantity,
  })
  .returning(columns);
  return sale_detail;
}

async function updateStock(item_id, quantity) {
  await knex('items')
    .where('id', item_id)
    .update({
      stock: knex.raw('?? - ' + quantity, ['stock'])
    })
}

async function update({ id, employee_id, customer_id, date }) {
  const columnInfo = await knex(TABLE_NAME).columnInfo();
  const columns = Object.keys(columnInfo);

  const [sale] = await knex(TABLE_NAME)
    .where({id})
    .update({
      employee_id: employee_id,
      customer_id: customer_id,
      updated_at: new Date(),
      date: date
    })
    .returning(columns);
  return sale;
}

async function updateDetail({ id, sale_id, item_id, unit_price, quantity }) {
  const columnInfo = await knex(TABLE_NAME_DETAIL).columnInfo();
  const columns = Object.keys(columnInfo);

  const [sale] = await knex(TABLE_NAME)
    .where({id})
    .update({
      sale_id: sale_id,
      item_id: item_id,
      unit_price: unit_price,
      quantity: quantity,
      updated_at: new Date(),
    })
    .returning(columns);
  return sale;
}

async function getById(id) {
  const [sale] = await knex(TABLE_NAME)
    .select(knex.raw('id, employee_id, customer_id, to_char(date, \'DD/MM/YYYY\') as date'))
    .where(id)
    .limit(1);
  return sale;
}

async function getAll() {
  const sales = await knex(TABLE_NAME)
    .join('employees', 'sales.employee_id', 'employees.id')
    .join('customers', 'sales.customer_id', 'customers.id')
    .select(
      knex.raw(
        "sales.id, CONCAT(employees.name, ' ', employees.last_name) as employee_name, CONCAT(customers.name, ' ', customers.last_name) as customer_name, to_char(sales.date, 'DD/MM/YYYY') as date, employees.id as employee_id, customers.id as customer_id"
      )
    )
    .where('sales.enable', '=', true);

  return sales;
}

async function getAllMonth() {
  const sales = await knex(TABLE_NAME)
    .join('employees', 'sales.employee_id', 'employees.id')
    .join('customers', 'sales.customer_id', 'customers.id')
    .whereRaw('EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM NOW())')
    .select(knex.raw('sales.id, employees.name as employee_name, employees.last_name as employee_last_name, customers.name as customer, to_char(sales.date, \'DD/MM/YYYY\') as date'));
  return sales;
}

async function getAllOrderByEmployee() {
  const sales = await knex(TABLE_NAME)
    .join('employees', 'sales.employee_id', 'employees.id')
    .join('customers', 'sales.customer_id', 'customers.id')
    .whereRaw('EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM NOW())')
    .orderBy('employees.last_name')
    .select(knex.raw('sales.id, employees.name as employee_name, employees.last_name as employee_last_name, customers.name as customer, to_char(sales.date, \'DD/MM/YYYY\') as date'));
  return sales;
}

async function getDetailById(id) {
  const details = await knex('sales_detail')
    .join('items', 'sales_detail.item_id', 'items.id')
    .where({sale_id: id})
    .select(['sales_detail.id', 'items.name', 'sales_detail.unit_price', 'sales_detail.quantity']);

    return details;
}

async function getTopItemsDb() {
  const topItems = await knex('sales_detail')
    .join('items', 'sales_detail.item_id', 'items.id')
    .select('sales_detail.item_id', 'items.code', 'items.name', 'items.stock',knex.raw('COUNT(*)'))
    .orderBy('count', 'desc')
    .groupByRaw('sales_detail.item_id, items.code, items.name, items.stock')
    .limit(5);
  return topItems;
}
async function getCountSalesForDay() {
  const countSaleForDay = await knex(TABLE_NAME)
    .select(knex.raw('COUNT(*), to_char(date, \'DD/MM/YYYY\') as date'))
    .orderBy('date', 'desc')
    .groupByRaw('date');

  return countSaleForDay;
}
async function getItemsCriticalStockDb() {
  const topItems = await knex('items')
    .select('id', 'code', 'name', 'stock', 'critical_stock')
    .whereRaw('stock between 0 and critical_stock');
  return topItems;
}
async function deleteById(id) {
  const [purchase] = await knex(TABLE_NAME)
    .where({ id })
    .update({
      enable: false,
      updated_at: new Date(),
    })
    .returning(['id']);
  return purchase;
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
  updateStock,
  deleteById,
  getCountSalesForDay,
};
