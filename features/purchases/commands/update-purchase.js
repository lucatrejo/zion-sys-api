const { update } = require('../repository');

async function updatePurchase(req, res) {
  let purchase = {};
  const id = req.params.id;
  const createSuccessMessage = "La compra se actualizó con éxito.";

  try {
    purchase = await update({ ...req.body, id });
  } catch (error) {
    purchase = error;
  }

  if (purchase.id) {
    return res.send({
      success: true,
      purchase: { ...purchase },
      messages: { success: createSuccessMessage }
    });
  }

  const databaseError = 'Hubo un problema en la actualización de la compra.';
  return res.status(500).send({ success: false, messages: { errors: { databaseError }} });
}

module.exports = updatePurchase;
