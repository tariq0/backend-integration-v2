// Generic pagination middleware to be used
// in any app that uses monggose

function paginate(Model_, perPage_, page_){
    return (req, res, next) =>{
        // middleware logic

        // find logic

        // data sent logic
        // Document found, nextPageState [ok, last],
        // previousPageState [ok, first],
    }
}

function paginateById(Model_, perPage_, page_,){
    return (req, res, next) =>{
        // middleware logic
        
        // find by id logic

        // data sent logic
        // Document found, nextPageState [ok, last],
        // previousPageState [ok, first],
    }
}

function paginateByCase(Model_, perPage_, page_,){
    return (req, res, next) =>{
        // middleware logic
        
        // find by case

        // data sent logic
        // Document found, nextPageState [ok, last],
        // previousPageState [ok, first],
    }
}
