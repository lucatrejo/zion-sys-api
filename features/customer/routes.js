const { wrap } = require('async-middleware');
const router = require('express').Router();

const createCustomer = require('./commands/create-customer');
const updateCustomer = require('./commands/update-customer');
const deleteCustomer = require('./commands/delete-customer');
const { getCustomer, getCustomers, getCustomerByName } = require('./commands/get-customer');

router.post('/', wrap(createCustomer));
router.put('/:id', wrap(updateCustomer));
router.get('/:id', wrap(getCustomer));
router.get('/:name/search', wrap(getCustomerByName));
router.get('/', wrap(getCustomers));
router.delete('/:id', wrap(deleteCustomer));

module.exports = router;
