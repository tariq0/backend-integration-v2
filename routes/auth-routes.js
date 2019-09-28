//
const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth-controller');
const authMiddlewares = require('../middlewares/auth-middleware');
const hasPermisiion = authMiddlewares.hasPermission;



const getAll = auth.getAll;
const getById = auth.getById;
const create = auth.create;
const update = auth.update;
const delete_ = auth.delete_;
const signUp = auth.signUp;
const logIn = auth.logIn;
const logOut = auth.logOut;

// requires no permissions
router.post('/signup', signUp);

router.post('/login', logIn);

router.post('/logout', logOut);

// requires read permission
router.get('/', hasPermisiion('read'), getAll);

router.get('/:id',hasPermisiion('read'), getById);

// requires create permissions
router.post('/',hasPermisiion('create'), create);

// requires modify permissions
router.put('/:id',hasPermisiion('modify'), update);

// requires delete permission
router.delete('/:id',hasPermisiion('delete'), delete_);

/*
// test routes 
router.post('/isauth',isAuthorized,(req, res, next)=>{
    res.json(req.user);
});


// test routes.
router.post(
    '/hasperm',authMiddleware,hasPermisiion('modifyNews'),
    (req, res, next)=>{
    res.json(req.user);

});*/
router.all('**',(req, res, next)=>{
    let error = new Error('page not found');
    res.statusCode =404;
    next(error);
});

module.exports = router;