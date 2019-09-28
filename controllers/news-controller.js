//
//
//
//

const Model = require('../models/news');
const ResponseObject = require('../models/response_object');

// constants used to customize error messages
// but not used here
//const connectionError = 'connection failed';
const successMessage = 'success';
//const failMessage = 'operation failed';
//const validationError = 'please check required fields';


//
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
    // three possible errors
    // validation
    // connection
    // unique fields
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
            // validation 
            if (err.name == 'MongoError'
                && err.code
                || err.name == 'validationError'
                || err.name == 'CastError'
            ) {
                res.statusCode = 400;
                next(err);
            } else {
                console.log(err)
                next(err);
            }
        })
}

// update
function update(req, res, next) {
    let update = req.body;
    Model.findByIdAndUpdate(
        req.params.id,
        update, (err, data) => {
            if (err) {
                if (err.name == 'CastError'
                    || err.name == 'MongoError' // unique field error
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
// delete
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
    update: update,
    delete_: delete_,
    create: create
}