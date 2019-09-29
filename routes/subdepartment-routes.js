const express = require('express');
const router = express.Router();

const subDep = require('../controllers/subdepartment-controller');
const auth = require('../middlewares/auth-middleware');
const hasPermission = auth.hasPermission;

const getAll =  subDep.getAll;
const getById = subDep.getById;
const create = subDep.create;
const update = subDep.update;
const delete_ = subDep.delete_;

// all
router.get('', getAll);

// specific
router.get('/:id',getById);

// create
router.post('', hasPermission('create'), create);

// update by id
router.put('/:id', hasPermission('modify'),update);

// delete by id 
router.delete('/:id', hasPermission('delete'),delete_);

// not found case



module.exports = router;