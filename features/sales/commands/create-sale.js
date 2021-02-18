const {insert, insertDetail, updateStock, updateAccount,insertDetailAccount} = require('../repository');

const logger = require('../../../logger');

async function createSale(req, res) {
  let purchase = {};
  let totalAmount = 0;
  let accountId = 0;

  const createSuccessMessage = 'La venta se creó con éxito.';

  try {
    purchase = await insert(req.body);

    req.body.details.forEach(d => {
      totalAmount += d.unit_price * d.quantity;
      insertDetail(purchase.id, d.item_id, d.unit_price, d.quantity);
      updateStock(d.item_id, d.quantity);
    });

    if (req.body.credit === true) {
      logger.info(totalAmount);
      accountId = await updateAccount(req.body, totalAmount);
      await insertDetailAccount(purchase.id, accountId[0].id, 'owed', req.body.date);
    }
  } catch (error) {
    logger.error(error);
    purchase = error;
  }

  if (purchase.id) {
    return res.send({
      success: true,
      purchase: {...purchase},
      messages: {success: createSuccessMessage}
    });
  }

  const databaseError = 'Hubo un problema en la creación de la venta.';
  return res.status(500).send({success: false, messages: {errors: {databaseError}}});
}

module.exports = createSale;
