const { getById, getAll, getCustomerWithName,getAccount,getDetailAccount,getCustomerWithLastName, getAccountsUpToDate, getAccountsDebtor, getAccountsMorosos } = require('../repository');
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
async function getCustomerByLastName(req, res) {
  let customers = [];
  const {last_name} = req.params;

  try {
    customers = await getCustomerWithLastName(last_name);
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

async function getUpToDate(req, res) {
  logger.info("LLEGO");
  let result = [];

  try {
    logger.info("LLEGO");

    result = await getAccountsUpToDate();

  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, messages: 'error getting report' });
  }

  if (result) {
    return res.send({ result });
  }
}

async function getDebtors(req, res) {
  logger.info("MOROSO");
  let result = [];

  try {
    accounts = await getAccountsMorosos();

    for (const account of accounts) {
      let date = account.first_debt_date;

      logger.info(date);
      logger.info(new Date());

      var dateDiff = new Date().getTime() - date.getTime();
      var daysDiff = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
      logger.info(daysDiff);

      if (daysDiff <= 45) {
        result.push(account);
      }
    }



    logger.info(result);

  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, messages: 'error getting report' });
  }

  if (result) {
    return res.send({ result });
  }
}

async function getMorosos(req, res) {
  logger.info("MOROSO");
  let result = [];

  try {
    accounts = await getAccountsMorosos();

    for (const account of accounts) {
      let date = account.first_debt_date;

      logger.info(date);
      logger.info(new Date());

      var dateDiff = new Date().getTime() - date.getTime();
      var daysDiff = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
      logger.info(daysDiff);

      if (daysDiff >= 45) {
        result.push(account);
      }
    }



    logger.info(result);

  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, messages: 'error getting report' });
  }

  if (result) {
    return res.send({ result });
  }
}

module.exports = {
  getCustomer,
  getCustomers,
  getCustomerByName,
  getAccounts,
  getCustomerByLastName,
  getUpToDate,
  getDebtors,
  getMorosos
};
