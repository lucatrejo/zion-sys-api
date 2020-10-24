const { update } = require('../repository');

async function updateProvider(req, res) {
  let provider = {};
  const id = req.params.id;

  try {
    provider = await update({ ...req.body, id });
  } catch (error) {
    provider = error;
  }

  if (provider.id) {
    return res.send({
      success: true,
      provider: { ...provider },
      messages: { success: 'El proveedor se ha actualizado con éxito.' }
    });
  }

  const { code } = provider;

  if(code === '23505') {
    const name = 'El nombre del proveedor ya existe.';
    return res.status(500).send({ success: false, messages: { errors: { name }} });
  }

  const databaseError = 'Hubo un problema en la actualización del proveedor.';
  return res.status(500).send({ success: false, messages: { errors: { databaseError }} });
}

module.exports = updateProvider;
