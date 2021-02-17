const { getById, getAll, getDetailById, getTopItemsDb, getItemsCriticalStockDb, getAllMonth, getAllOrderByEmployee,getCountSalesForDay } = require('../repository');
const logger = require('../../../logger');

async function getSale(req, res) {
  let sale = {};
  const id = req.params.id;

  try {
    sale = await getById({ id });
  } catch (error) {
    return res.status(500).send({ success: false, message: 'error getting sale' });
  }

  if (sale.id) {
    return res.send(sale);
  }
}

async function getSalesWithDetail(req, res) {
  let sales = [];

  try {
    sales = await getAll();

    for (let sale of sales) {
      let details = [];
      details = await getDetailById(sale.id);
      sale.details = details;
    }

  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, message: 'error getting sales' });
  }

  if (sales) {
    return res.send({ sales });
  }
}

async function getSalesWithDetailMonth(req, res) {
  let sales = [];
  let result = [];

  try {
    sales = await getAllMonth();

    for (let sale of sales) {
      let details = [];
      details = await getDetailById(sale.id);

      for(let detail of details) {
        result.push({
          item: detail.name,
          quantity: detail.quantity,
          unit_price: detail.unit_price,
          customer: sale.customer,
          date: sale.date,
        })
      }
    }

  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, message: 'error getting sales' });
  }

  if (result) {
    return res.send({ result });
  }
}

async function getSalesWithDetailOrderEmployee(req, res) {
  let sales = [];
  let result = [];

  try {
    sales = await getAllOrderByEmployee();

    for (let sale of sales) {
      let details = [];
      details = await getDetailById(sale.id);
      for(let detail of details) {
        result.push({
          employee: sale.employee_name + ", " + sale.employee_last_name,
          date: sale.date,
          item: detail.name,
          quantity: detail.quantity,
          unit_price: detail.unit_price,
        })
      }
    }

  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, message: 'error getting sales' });
  }

  if (result) {
    return res.send({ result });
  }
}

async function getSales(req, res) {
  let sales = [];

  try {
    sales = await getAll();
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, message: 'error getting sales' });
  }

  if (sales) {
    return res.send({ sales });
  }
}

async function getTopItems(req, res) {
  let top_items = [];

  try {
    top_items = await getTopItemsDb();
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, message: 'error getting top items' });
  }

  if (top_items) {
    return res.send({ top_items });
  }
}
async function getCountsSaleForDay(req, res) {
  let getCountSales = [];

  try {
    getCountSales = await getCountSalesForDay();
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, message: 'error getting top items' });
  }

  if (getCountSales) {
    return res.send({ getCountSales });
  }
}
async function getItemsCriticalStock(req, res) {
  let items = [];

  try {
    items = await getItemsCriticalStockDb();
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, message: 'error getting items with critical stock' });
  }

  if (items) {
    return res.send({ items });
  }
}

async function getSaleDetail(req, res) {
  let details = [];
  const id = req.params.id;

  try {
    details = await getDetailById(id);
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, message: 'error getting sales detail' });
  }

  if (details) {
    return res.send({ details });
  }
}

module.exports = {
  getSale: getSale,
  getSales,
  getSalesWithDetail,
  getSaleDetail,
  getTopItems,
  getItemsCriticalStock,
  getSalesWithDetailMonth,
  getSalesWithDetailOrderEmployee,
  getCountsSaleForDay,
};
