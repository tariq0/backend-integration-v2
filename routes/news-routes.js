const express = require('express');
const router = express.Router();
const Model = require('../models/news');
const Paginate = require('../controllers/pagination-controller');
//const paginate = Paginate.paginate;
const paginateSortByDate = Paginate.paginateSortByDate;
const news = require('../controllers/news-controller');
const auth = require('../middlewares/auth-middleware');
const hasPermission = auth.hasPermission;

const getAll =  news.getAll;
const getById = news.getById;
const create = news.create;
const update = news.update;
const delete_ = news.delete_;
const getLatestNews = news.getLatestNews;

// all
router.get('', getAll);

// specific
router.get('/:id',getById);

// pagination archive
router.get('/:perPage/:page',paginateSortByDate(Model));

// get latest news by current year if found else
// get all news and sort by date and pagenation in all cases.
router.get('/latest/:perPage/:page', getLatestNews);
router.get('/latest/:perPage/:page',paginateSortByDate(Model));
// create
router.post('', hasPermission('create'), create);

// update by id
router.put('/:id', hasPermission('modify'),update);

// delete by id 
router.delete('/:id', hasPermission('delete'),delete_);

// not found case


module.exports = router;