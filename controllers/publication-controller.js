//
//
//
//

const Model = require('../models/publication');
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
    // becareful when dealing with dates
    // it must be saved as dates.
    if (req.body.date) {
        instance.date = new Date(req.body.date);
        //console.log(instance.date);
    } else {
        instance.date = new Date();
        //console.log(instance.date);
    }

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
                || err.name == 'ValidationError'
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
//
function saver(req, res, next) {
    let instance = new Model(req.body);
    let images = [];
    let files = [];
    //console.log(req.files)
    req.files.images.forEach((file)=>{
        //mages.push(file.filename)
            images.push(file.filename);
    });
    req.files.files.forEach((file)=>{
        //mages.push(file.filename)
            files.push(file.filename);
    });

    // becareful when dealing with dates
    // it must be saved as dates.
    if (req.body.date) {
        instance.date = new Date(req.body.date);
        //console.log(instance.date);
    } else {
        instance.date = new Date();
        //console.log(instance.date);
    }

    instance.images = images;
    instance.files = files;
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
//
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
    create: create,
    saver: saver
}