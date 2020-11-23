const { getById, getAll, getDetailById, getTopItemsDb, getItemsCriticalStockDb, getAllMonth, getAllOrderByEmployee } = require('../repository');
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

  try {
    sales = await getAllMonth();

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

async function getSalesWithDetailOrderEmployee(req, res) {
  let sales = [];

  try {
    sales = await getAllOrderByEmployee();

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
  getSalesWithDetailOrderEmployee
};
