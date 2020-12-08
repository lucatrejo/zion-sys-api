const { wrap } = require('async-middleware');
const router = require('express').Router();

const createSale = require('./commands/create-sale');
const updateSale = require('./commands/update-sale');
const { getSale, getSales, getSalesWithDetail, getSaleDetail, getTopItems, getItemsCriticalStock, getSalesWithDetailMonth, getSalesWithDetailOrderEmployee,getCountsSaleForDay} = require('./commands/get-sale');
const deleteSale = require('./commands/delete-sale');

router.get('/count_sales', wrap(getCountsSaleForDay));
router.get('/top_items', wrap(getTopItems));
router.get('/items_critical_stock', wrap(getItemsCriticalStock));
router.get('/sales_month', wrap(getSalesWithDetailMonth));
router.get('/sales_employee', wrap(getSalesWithDetailOrderEmployee));
router.post('/', wrap(createSale));
router.put('/:id', wrap(updateSale));
router.get('/:id/details', wrap(getSaleDetail));
router.get('/details', wrap(getSalesWithDetail));
router.get('/:id', wrap(getSale));
router.get('/', wrap(getSales));
router.delete('/:id', wrap(deleteSale));

module.exports = router;
