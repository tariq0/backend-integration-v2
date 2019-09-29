//
//
//
//

const DepModel = require('../models/department');
const ResponseObject = require('../models/response_object');
const Errors = require('../Globals/Error-Messages');

// constants used to customize error messages
// but not used here
//const connectionError = 'connection failed';
const successMessage = 'success';
//const failMessage = 'operation failed';
//const validationError = 'please check required fields';


//
function getAll(req, res, next) {
    DepModel.find().
        then(doc => {
            const resObj = new ResponseObject(
                req.user,
                doc
            )
            res.json(resObj);
        }).
        catch(err =>{
            // only connection errors
            if (err.name == 'CastError'){
                res.statusCode = 404;
                err.message = Errors.pageNotFoundError;
                next(err);
            }
            else{
            res.statusCode = 500;
            err.message = Errors.connectionError;
            next(err);
            }
        })
}

function getById(req, res, next) {
    DepModel.findById(req.params.id).
        then(doc => {
            const resObj = new ResponseObject(
                req.user,
                doc
            )
            res.json(resObj);
        }).
        catch(err =>{
            // errors are connection errors or
            // cast error
            if (err.name == 'CastError'){
                res.statusCode = 404;
                err.message = Errors.pageNotFoundError;
                next(err);
            }else{
                res.statusCode = 500;
                err.message = Errors.connectionError;
                next(err);
            }
        })
}


function create(req, res, next) {
    // three possible errors
    // validation
    // connection
    // unique fields
    const instance = new DepModel(req.body);
    instance.save().
        then(v => {
            const resObj = new ResponseObject(
                req.user,
                successMessage
            )
            res.json(resObj);
        }).
        catch(err => {
            // validation
                res.statusCode = 400;
            if (err.name == 'MongoError'
                && err.code) {
                    res.statusCode = 500;
                err.message = Errors.mongoUniqueError;
                next(err);
            }
            else if (err.name == 'ValidationError') {
                res.statusCode = 400;
                err.message = Errors.ValidationError;
                next(err);
            }
            else if (err.name == 'CastError') {
                res.statusCode = 404;
                err.message = Errors.castError;
                next(err);
            } 
            else {
                console.log(err)
                next(err);
            }
        })
}

// update
function update(req, res, next) {
    let update = req.body;
    DepModel.findByIdAndUpdate(
        req.params.id,
        update, (err, data) => {
            if (err) {
                if (err.name == 'MongoError'
                && err.code) {
                    res.statusCode =500;
                err.message = Errors.mongoUniqueError;
                next(err);
            }
            else if (err.name == 'CastError') {
                res.statusCode =404;
                err.message = Errors.castError;
                next(err);
            } 
                else {
                    next(err);
                }
            } else {
                const resObj = new ResponseObject(
                    req.user,
                    successMessage
                )
                res.json(resObj);
            }
        }
    );

}
// delete
function delete_(req, res, next) {
    DepModel.findByIdAndDelete(
        req.params.id,
        (err, data) => {
            if (err) {
                if (err.name == 'CastError') {
                    res.statusCode = 404;
                    err.message = Errors.castError;
                    next(err);
                } else {
                    next(err);
                }
            } else {
                const resObj = new ResponseObject(
                    req.user,
                    successMessage
                )
                res.json(resObj);
            }

        });
}

module.exports = {
    getAll: getAll,
    getById: getById,
    update: update,
    delete_: delete_,
    create: create
}