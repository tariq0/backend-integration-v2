const express = require('express');
const router = express.Router();

const news = require('../controllers/news-controller');
const auth = require('../middlewares/auth-middleware');
const hasPermission = auth.hasPermission;

const getAll =  news.getAll;
const getById = news.getById;
const create = news.create;
const update = news.update;
const delete_ = news.delete_;

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