const { update } = require('../repository');
const logger = require('../../../logger');

async function updateItem(req, res) {
  let item = {};
  const id = req.params.id;

  try {
    item = await update({ ...req.body, id });
  } catch (error) {
    item = error;
  }

  if (item.id) {
    return res.send({
      success: true,
      item: { ...item },
      messages: { success: 'El artículo se ha actualizado con éxito.' }
    });
  }

  const { code } = item;

  if(code === '23505') {
    const name = 'El nombre del artículo ya existe.';
    return res.status(500).send({ success: false, messages: { errors: { name }} });
  }

  const databaseError = 'Hubo un problema en la actualización del artículo.';
  return res.status(500).send({ success: false, messages: { errors: { databaseError }} });
}

module.exports = updateItem;
