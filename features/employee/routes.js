const { wrap } = require('async-middleware');
const router = require('express').Router();

const createEmployee = require('./commands/create-employee');
const updateEmployee = require('./commands/update-employee');
const deleteEmployee = require('./commands/delete-employee');
const { getEmployee, getEmployees, getEmployeeByName } = require('./commands/get-employee');

router.post('/', wrap(createEmployee));
router.put('/:id', wrap(updateEmployee));
router.get('/:id', wrap(getEmployee));
router.get('/', wrap(getEmployees));
router.get('/:name/search', wrap(getEmployeeByName));
router.delete('/:id', wrap(deleteEmployee));


module.exports = router;
