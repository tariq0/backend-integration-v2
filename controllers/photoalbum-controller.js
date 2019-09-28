//
//
//
// 

const Model = require('../models/photoalbum');
const ResponseObject = require('../models/response_object');

//const connectionError = 'connection failed';
const successMessage = 'success';
//const fail = 'operation failed';
//const validationError = 'please check required fields';


function getAll(req, res, next) {
    Model.find().
        then(doc => {
            const resObj = new ResponseObject(
                req.user,
                doc
            )
            res.json(resObj);
        }).
        catch(err => {
            next(err);
        })
}


function getById(req, res, next) {
    Model.findById(req.params.id).
        then(doc => {
            const resObj = new ResponseObject(
                req.user,
                doc
            )
            res.json(resObj);
        }).
        catch(err => {
            if (err.name == 'CastError') {
                res.statusCode = 400;
                next(err);
            } else
                next(err);
        })
}



function create(req, res, next) {
    const instance = new Model(req.body);
    instance.save().
    then(v => {
        const resObj = new ResponseObject(
            req.user,
            successMessage
        )
        res.json(resObj);
    }).
        catch(err => {
            // unique fields errors
            console.log(err);
            if (err.name == 'MongoError'
                && err.code
                || err.name == 'ValidationError'
                || err.name == 'CastError'
            ) {
                res.statusCode = 400;
                next(err);
            } else {
                next(err);
            }
        })
}

function update(req, res, next) {
    let update = req.body;
    Model.findByIdAndUpdate(
        req.params.id,
        update, (err, data) => {
            if (err) {
                if (err.name == 'CastError'
                    || err.name == 'MongoError'
                    && err.code
                ) {
                    res.statusCode = 400;
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
        }
    );

}


function delete_(req, res, next) {
    Model.findByIdAndDelete(
        req.params.id,
        (err, data) => {
            if (err) {
                if (err.name == 'CastError') {
                    res.statusCode = 400;
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
    delete_: delete_,
    update: update,
    create: create
}