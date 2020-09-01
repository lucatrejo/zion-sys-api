const { wrap } = require('async-middleware');
const router = require('express').Router();

const createPurchase = require('./commands/create-purchase');
const updatePurchase = require('./commands/update-purchase');
const { getPurchase, getPurchases, getPurchasesWithDetail, getPurchaseDetail, getTopItems, getItemsCriticalStock, getPurchasesWithDetailMonth, getPurchasesWithDetailOrderEmployee} = require('./commands/get-purchase');

router.get('/top_items', wrap(getTopItems));
router.get('/items_critical_stock', wrap(getItemsCriticalStock));
router.get('/purchases_month', wrap(getPurchasesWithDetailMonth));
router.get('/purchases_employee', wrap(getPurchasesWithDetailOrderEmployee));
router.post('/', wrap(createPurchase));
router.put('/:id', wrap(updatePurchase));
router.get('/:id/details', wrap(getPurchaseDetail));
router.get('/details', wrap(getPurchasesWithDetail));
router.get('/:id', wrap(getPurchase));
router.get('/', wrap(getPurchases));

module.exports = router;
