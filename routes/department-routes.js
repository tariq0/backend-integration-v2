const express = require('express');
const router = express.Router();

const dep = require('../controllers/department-controller');
const auth = require('../middlewares/auth-middleware');
const hasPermission = auth.hasPermission;

const getAll =  dep.getAll;
const getById = dep.getById;
const create = dep.create;
const update = dep.update;
const delete_ = dep.delete_;

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