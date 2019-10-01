//
//
// object that send to any request requires pagination.
class PaginatationObject {
    constructor(
        numberOfDocs_,
        numberOfPages_,
        previousState_,
        nextState_
    ) {
        this.umberOfDocs = numberOfDocs_;
        this.numberOfPages = numberOfPages_;
        this.previousState = previousState_;
        this.nextState = nextState_;
    };
}

module.exports = PaginatationObject;