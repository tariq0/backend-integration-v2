//
//
//
//

const Model = require('../models/news');
const ResponseObject = require('../models/response_object');
const PaginationObject = require('../models/pagination-object');

// constants used to customize error messages
// but not used here
//const connectionError = 'connection failed';
const successMessage = 'success';
//const failMessage = 'operation failed';
//const validationError = 'please check required fields';


// gets latest news
// this is the archive.
function getAll(req, res, next) {
    Model.find().select({ date: 1, title_en: 1 }).sort({ date: -1 }).
        /*then(doc => {
            const resObj = new ResponseObject(
                req.user,
                doc
            )
            res.json(resObj);
        }).
        catch(err => {
            next(err);
        })*/
        exec((err, doc) => {
            if (!err) {
                const resObj = new ResponseObject(
                    req.user,
                    doc
                )
                res.json(resObj);
            } else {
                next(err);
            }
        });
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
                //res.statusCode = 400;
                next();
            } else
                next(err);
        })
}

async function getLatestNewsWithPagination(req, res, next) {
    // filter variables
    let currentYear = new Date().getFullYear();
    let ltYear = currentYear + 1;
    let gtYear = currentYear - 1;
    let ltDate = `${ltYear}-01-01`;
    let gtDate = `${gtYear}-01-01`;
    console.log(ltYear, gtYear, ltDate, gtDate);
    //
    let docsCount = await Model.countDocuments(
        {
            date: {
                $gt: gtDate,
                $lt: ltDate
            }
        }
    );

    if (docsCount) {
        // pagenation variables;
        try {
            var limit = parseInt(req.params.perPage);
            var skip = (req.params.page - 1) * limit;
            var numberOfPages = Math.ceil(docsCount / limit);
            var previousState = true;
            var nextSate = false;
        } catch (err) {
            const error = new Error('per Page can\'t be zero');
            next(error);
        }
        //
        Model.find({ date: { $gt: gtDate, $lt: ltDate } }).
            skip(skip).
            limit(limit).
            sort({ date: -1 }).
            exec((err, data) => {
                if (!err) {

                    if (skip == 0)
                        previousState = false;
                    if (docsCount > limit * parseInt(req.params.page)) {
                        nextSate = true;
                        //console.log(nextSate);
                    }


                    const pagObject = new PaginationObject(
                        docsCount,
                        numberOfPages,
                        previousState,
                        nextSate
                    );
                    const resObj = new ResponseObject(
                        req.user,
                        {
                            pagenation: pagObject,
                            doc: data
                        }
                    )
                    res.json(resObj);
                } else {
                    next(err);
                }
            });
    } else {
        // if no current year inputs go to the next middleware
        // which will call all news and paginate.
        next();
    }
}
function create(req, res, next) {
    // three possible errors
    // validation
    // connection
    // unique fields
    let instance = new Model(req.body);
    if (req.body.date) {
        instance.date = new Date(req.body.date);
        console.log(instance.date);
    } else {
        instance.date = new Date();
        console.log(instance.date);
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
//
//
function saver(req, res, next) {
    let instance = new Model(req.body);
    let images = [];
    let files = [];
    //console.log(req.files)
    req.files.images.forEach((file) => {
        //mages.push(file.filename)
        images.push(file.filename);
    });
    req.files.files.forEach((file) => {
        //mages.push(file.filename)
        files.push(file.filename);
    });
    instance.images = images;
    instance.files = files;

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
            // unique fields errors
            //console.log(err);
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
    saver: saver,
    getLatestNews: getLatestNewsWithPagination
}