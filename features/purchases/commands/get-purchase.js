const { getById, getAll, getDetailById, getTopItemsDb, getItemsCriticalStockDb, getAllMonth, getAllOrderByEmployee,getAllMonths } = require('../repository');
const logger = require('../../../logger');

async function getPurchase(req, res) {
  let purchase = {};
  const id = req.params.id;

  try {
    purchase = await getById({ id });
  } catch (error) {
    return res.status(500).send({ success: false, message: 'error getting purchase' });
  }

  if (purchase.id) {
    return res.send(purchase);
  }
}

async function getPurchasesWithDetail(req, res) {
  let purchases = [];

  try {
    purchases = await getAll();

    for (let purchase of purchases) {
      let details = [];
      details = await getDetailById(purchase.id);
      purchase.details = details;
    }

  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, message: 'error getting purchases' });
  }

  if (purchases) {
    return res.send({ purchases });
  }
}

async function getPurchasesWithDetailMonth(req, res) {
  let purchases = [];
  let result = [];

  try {
    purchases = await getAllMonth();

    for (let purchase of purchases) {
      let details = [];
      details = await getDetailById(purchase.id);

      for (let detail of details) {
        result.push({
          name: detail.name,
          quantity: detail.quantity,
          unit_price: detail.unit_price,
          provider: purchase.provider,
          date: purchase.date,
        })
      }
    }

  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, message: 'error getting purchases' });
  }

  if (result) {
    return res.send({ result });
  }
}
async function getPurchasesWithDetailMonths(req, res) {
  let purchases = [];

  try {
    purchases = await getAllMonths();

    for (let purchase of purchases) {
      let details = [];
      details = await getDetailById(purchase.id);
      purchase.details = details;
    }

  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, message: 'error getting purchases' });
  }

  if (purchases) {
    return res.send({ purchases });
  }
}

async function getPurchasesWithDetailOrderEmployee(req, res) {
  let purchases = [];
  let result = [];

  try {
    purchases = await getAllOrderByEmployee();

    for (let purchase of purchases) {
      let details = [];
      details = await getDetailById(purchase.id);

      for (let detail of details) {
        result.push({
          employee_name: purchase.employee_name + ", " + purchase.employee_last_name,
          date: purchase.date,
          item: detail.name,
          quantity: detail.quantity,
          unit_price: detail.unit_price,
        })
      }
    }

  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, message: 'error getting purchases' });
  }

  if (result) {
    return res.send({ result });
  }
}

async function getPurchases(req, res) {
  let purchases = [];

  try {
    purchases = await getAll();
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, message: 'error getting purchases' });
  }

  if (purchases) {
    return res.send({ purchases });
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

async function getPurchaseDetail(req, res) {
  let details = [];
  const id = req.params.id;

  try {
    details = await getDetailById(id);
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, message: 'error getting purchases detail' });
  }

  if (details) {
    return res.send({ details });
  }
}

module.exports = {
  getPurchase,
  getPurchases,
  getPurchasesWithDetail,
  getPurchaseDetail,
  getTopItems,
  getItemsCriticalStock,
  getPurchasesWithDetailMonth,
  getPurchasesWithDetailOrderEmployee,
  getPurchasesWithDetailMonths,
};
