//
// setting headers to allow CORS
function cors(req, res, next) {
    //all domains can access our server
    res.setHeader('Access-Control-Allow-Origin','*');
    // allow some HTTP methods to be used to access resources 
    res.setHeader(
        'Access-Control-Allow-Methods',
        'PUT, GET, POST, DELETE, OPTIONS'
        );
    // allow some headers to used
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Cookie, Set-Cookie,Origin'
        );
    /*res.setHeader(
        'Access-Control-Allow-Headers',
        '*'
        );*/
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('preflightContinue',true);
    res.setHeader('Access-Control-Max-Age', 86400);
    next();
}

module.exports = cors;