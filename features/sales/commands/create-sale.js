const { insert, insertDetail, updateStock } = require('../repository');
const logger = require('../../../logger');

async function createSale(req, res) {
  let purchase = {};
  const createSuccessMessage = "La venta se creó con éxito.";

  try {
    purchase = await insert(req.body);    

    req.body.details.forEach(d => {
      insertDetail(purchase.id, d.item_id, d.unit_price, d.quantity);
      updateStock(d.item_id, d.quantity);
    });
  } catch (error) {
    logger.error(error);
    purchase = error;
  }

  if (purchase.id) {
    return res.send({
      success: true,
      purchase: { ...purchase },
      messages: { success: createSuccessMessage }
    });
  }

  const databaseError = 'Hubo un problema en la creación de la venta.';
  return res.status(500).send({ success: false, messages: { errors: { databaseError }} });
}

module.exports = createSale;
