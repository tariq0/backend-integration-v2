// file contains authentication methods
// checks if logged in 
// checks if permission exists
//
// header used to get token is cookie
// you can specify some thing else
//

const jwt = require('jsonwebtoken');
const authConfig = require('../configuration/auth-config');
//
//
const secret = authConfig.secret;
const Errors = require('../Globals/Error-Messages');




function authMiddleware(req, res, next) {
    if(!req.get('Cookie')){
        // non logged user
        const anUser ={
            role:'',
            permissions:''
        }
        req.user = anUser;
        console.log(req.user);
        next();
    }else{
        // users cliam to be logged in
        let token = req.get('Cookie');
        token = token.toString().split('=')[1];
        // decodedToken;
        try{ // if true set user to them
            const decodedToken= jwt.verify(token, secret);
            let permArr = decodedToken.permissions.split(',');
            let user ={
                first_name: decodedToken.first_name,
                last_name: decodedToken.last_name,
                email: decodedToken.email,
                role: decodedToken.role,
                permissions: permArr,
            }
            req.user = user;

        }catch(err){     
            let anUser ={
                role:'',
                permissions:''
            }
            req.user = anUser;
        }   
        next();   
    }
}


//
function isAuthorized(req, res, next) {
    if(req.user.role){
         next();
    }else {
        const error = new Error(Errors.unAuthorizedError);
        res.statusCode = 400;
        next(error);
    }
}


function hasPermission(perm) {
    return (req, res, next)=>{
        const user = req.user;
        if(user.role == 'root'){
            return next();
        }else if (
            user.permissions.indexOf(perm)>-1 
            && user.role == 'admin' ){
            return next();
        }else{
            res.statusCode = 400;
            const error = new Error(Errors.noPermissionError);
            next(error);
        }
    }
}


module.exports = {
    authMiddleware: authMiddleware,
    isAuthorized: isAuthorized,
    hasPermission: hasPermission,
}
