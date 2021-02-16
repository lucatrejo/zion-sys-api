const { update, updateAccount, updateAccountDetail , getDetailAccountById,updateAccountDetailById} = require('../repository');
const { getSaleDetailsBySaleId} = require('../../sales/repository');

const logger = require('../../../logger');

async function updateCustomer(req, res) {
  let customer = {};
  const id = req.params.id;

  try {
    customer = await update({ ...req.body, id });
  } catch (error) {
    customer = error;
  }

  if (customer.id) {
    return res.send({
      success: true,
      customer: { ...customer },
      messages: { success: 'El cliente se ha actualizado con éxito.' }
    });
  }

  const { code } = customer;

  if(code === '23505') {
    const identification = 'El dni del cliente ya existe.';
    return res.status(500).send({ success: false, messages: { errors: { identification }} });
  }

  const databaseError = 'Hubo un problema en la actualización del cliente.';
  return res.status(500).send({ success: false, messages: { errors: { databaseError }} });
}
async function payTotalDebt(req, res) {
  let accountId = 0;
  const { idAccount } = req.params;
  const id = idAccount;
  const editMessage = 'El cliente saldo la deuda';
  try {
    accountId = await updateAccount({ id }, 0);
    await updateAccountDetail(accountId[0].id, 'paid');
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, messages: `error getting Accounts:${idAccount}` });
  }

  return res.send({
    success: true,
    customer: { id },
    messages: { success: editMessage },
  });
}

async function payPartialDebt(req, res) {
  const { detailId } = req.params;
  const { idAccount } = req.params;
  let id;
  const editMessage = 'El cliente saldo la deuda parcial';

  let detailAccount;
  let detailSale = [];
  let totalAmount = 0;



  try {
    id = detailId;

    detailAccount = await getDetailAccountById({ id });
    detailSale = await getSaleDetailsBySaleId(detailAccount.sale_id);

    for (const detail of detailSale) {
      totalAmount += detail.unit_price * detail.quantity;
    }
    id = idAccount;

    await updateAccount({ id }, totalAmount);
    id = detailId;

    await updateAccountDetailById({ id }, 'paid');
  } catch (error) {
    logger.error(error);
    return res.status(500).send({successgetAccounts: false, messages: `error getting Accounts${totalAmount}`});
  }

  return res.send({
    success: true,
    customer: { detailId },
    messages: { success: editMessage },
  });
}

module.exports = {
  updateCustomer,
  payTotalDebt,
  payPartialDebt,
};
