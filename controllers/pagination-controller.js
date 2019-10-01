// Generic pagination middleware to be used
// in any app that uses monggose

// imports

const ResponseObject = require('../models/response_object');
const PaginationObject = require('../models/pagination-object');

function paginate(Model_) {
    return async (req, res, next) => {
        console.log(req.params.page, req.params.perPage);
        let limit = parseInt(req.params.perPage);
        let skip = (parseInt(req.params.page) - 1)*limit;
        
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
        const pagObject = new PaginationObject(
            docCount,
            numberOfPages, 
            previousState, 
            nextState
        );

        const resObj = new ResponseObject(
            req.user,
            {
                pagination: pagObject,
                doc: doc
            }
        )
        res.send(resObj);

    }

}

function paginateSortByDate(Model_) {
    return async (req, res, next) => {
        console.log(req.params.page, req.params.perPage)

        let limit = parseInt(req.params.perPage);
        let skip =( parseInt(req.params.page) - 1)* limit;
        
        let docCount;
        let nextState = false;
        let previousState = true;
        let numberOfPages;

        docCount = await Model_.estimatedDocumentCount();
        console.log(docCount);
        let doc = await Model_.find().
        sort({date: -1}).
        skip(skip).
        limit(limit);

        if (skip == 0)
           { previousState = false;}
        if (docCount > parseInt(req.params.page) * limit)
           { nextState = true;}

        numberOfPages = Math.ceil(docCount / limit);
        const pagObject = new PaginationObject(
            docCount,
            numberOfPages,
            previousState,
            nextState
        );
        const resObj = new ResponseObject(
            req.user,
            {
                pagenation: pagObject,
                doc: doc
            }
        )
        res.send(resObj);

    }

}
module.exports = {
    paginate: paginate,
    paginateSortByDate: paginateSortByDate
}
