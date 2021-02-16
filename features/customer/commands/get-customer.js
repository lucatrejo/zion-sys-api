const { getById, getAll, getCustomerWithName,getAccount,getDetailAccount } = require('../repository');
const logger = require('../../../logger');
const { getSaleDetailsBySaleId } = require('../../sales/repository');

async function getCustomer(req, res) {
  let customer = {};
  const id = req.params.id;

  try {
    customer = await getById({ id });
  } catch (error) {
    return res.status(500).send({ success: false, message: 'error getting customer' });
  }

  if (customer.name) {
    return res.send(customer);
  }
}

async function getCustomers(req, res) {
  let customers = [];

  try {
    customers = await getAll();
  } catch (error) {
    return res.status(500).send({ success: false, message: 'error getting customer' });
  }

  if (customers) {
    return res.send({ customers });
  }
}

async function getCustomerByName(req, res) {
  let customers = [];
  const name = req.params.name;

  try {
    customers = await getCustomerWithName(name);
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, messages: 'error getting customer' });
  }

  if (customers) {
    return res.send({ customers });
  }
}
async function getAccounts(req, res) {
  let account = {};
  const { id } = req.params;
  let detailsSale = [];
  let totalAmount = 0;

  try {
    account = await getAccount(id);
    let details = [];

    details = await getDetailAccount(account.id);


    account.details = details;
    for (const detail of details) {
      detailsSale = await getSaleDetailsBySaleId(detail.sale_id);
      logger.info(detailsSale);

      totalAmount = 0;
      for (const detailSale of detailsSale) {
        totalAmount += detailSale.unit_price * detailSale.quantity;
      }

      detail.totalAmount = totalAmount;
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, messages: 'error getting Accounts' });
  }

  if (account) {
    return res.send({ account });
  }
}

module.exports = {
  getCustomer,
  getCustomers,
  getCustomerByName,
  getAccounts,
};
