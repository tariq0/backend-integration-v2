const express = require('express');
const router = express.Router();

const pub = require('../controllers/publication-controller');
const auth = require('../middlewares/auth-middleware');
const hasPermission = auth.hasPermission;

const getAll =  pub.getAll;
const getById = pub.getById;
const create = pub.create;
const update = pub.update;
const delete_ = pub.delete_;

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