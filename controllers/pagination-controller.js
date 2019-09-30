// Generic pagination middleware to be used
// in any app that uses monggose

// imports

const ResponseObject = require('../models/response_object');

function paginate(Model_) {
    return async (req, res, next) => {
        try {
            //console.log(req.params.page, req.params.perPage)
            let skip = parseInt(req.params.page) - 1;
            let limit = parseInt(req.params.perPage);
            let docCount;
            let nextState = false;
            let previousState = true;
            let numberOfPages;

            docCount = await Model_.estimatedDocumentCount();
            console.log(docCount);
            let doc = await Model_.find().skip(skip).limit(limit);
            if (skip == 0)
                previousState = false;
            if (docCount > parseInt(req.params.page) * limit)
                nextState = true;
            numberOfPages = Math.ceil(docCount / limit);
            const resObj = new ResponseObject(
                req.user,
                {
                    docCount: docCount,
                    numberOfPages: numberOfPages,
                    nextState: nextState,
                    previousState: previousState,
                    doc: doc
                }
            )
            res.send(resObj);
        } catch(err){
            next(err);
        }

    }

}
module.exports = paginate;
