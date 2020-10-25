const { wrap } = require('async-middleware');
const router = require('express').Router();

const createItem = require('./commands/create-item');
const updateItem = require('./commands/update-item');
const deleteItem = require('./commands/delete-item');
const { getItem, getItems } = require('./commands/get-item');

router.post('/', wrap(createItem));
router.put('/:id', wrap(updateItem));
router.get('/:id', wrap(getItem));
router.get('/', wrap(getItems));
router.delete('/:id', wrap(deleteItem));

module.exports = router;
