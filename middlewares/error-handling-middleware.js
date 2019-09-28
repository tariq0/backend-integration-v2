

function errorHandler(err, req, res, next){
    if(res.statusCode != 200)
        res.json({
            user: req.user,
            data:{
                error: err.message
            }
        });
    else{
        res.statusCode = 500;
        res.json({
            user: req.user,
            data:{
                error: err.message
            }
        });
    }
}

module.exports = errorHandler;