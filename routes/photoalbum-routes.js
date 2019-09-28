const express = require('express');
const router = express.Router();

const Photolbum = require('../controllers/photoalbum-controller');
const auth = require('../middlewares/auth-middleware');
const hasPermission = auth.hasPermission;


const getAll =  Photolbum.getAll;
const getById = Photolbum.getById;
const create = Photolbum.create;
const update = Photolbum.update;
const delete_ = Photolbum.delete_;

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