const { update } = require('../repository');

async function updateCategory(req, res) {
  let category = {};
  const id = req.params.id;
  
  try {
    category = await update({ ...req.body, id });
  } catch (error) {
    category = error;
  }

  if (category.id) {
    return res.send({
      success: true,
      category: {...category},
      messages: {success: 'La categoría se actualizó con éxito.'}
    });
  }

  const { code } = category;

  if(code === '23505') {
    const name = 'El nombre de la categoría ya existe.';
    return res.status(500).send({ success: false, messages: { errors: { name }} });
  }

  const databaseError = 'Hubo un problema en la actualización de la categoría.';
  return res.status(500).send({ success: false, messages: { errors: { databaseError }} });
}

module.exports = updateCategory;
