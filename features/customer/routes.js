const { wrap } = require('async-middleware');
const router = require('express').Router();

const createCustomer = require('./commands/create-customer');
const { updateCustomer, payTotalDebt, payPartialDebt } = require('./commands/update-customer');
const deleteCustomer = require('./commands/delete-customer');
const { getCustomer, getCustomers, getCustomerByName, getAccounts,getCustomerByLastName } = require('./commands/get-customer');

router.post('/', wrap(createCustomer));
router.put('/:id', wrap(updateCustomer));
router.get('/:id', wrap(getCustomer));
router.get('/:name/search', wrap(getCustomerByName));
router.get('/:last_name/searchLastName', wrap(getCustomerByLastName));
router.get('/', wrap(getCustomers));
router.delete('/:id', wrap(deleteCustomer));
router.get('/:id/accounts', wrap(getAccounts));
router.put('/accounts/:idAccount', wrap(payTotalDebt));
router.put('/accounts/:idAccount/detail-accounts/:detailId', wrap(payPartialDebt));

module.exports = router;
