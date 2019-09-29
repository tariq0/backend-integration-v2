// users related methods
// create update delete read|view
// signup login logout
//
//
const encryption = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const authConfig = require('../configuration/auth-config');
const auth = require('../middlewares/auth-middleware');
const Errors = require('../Globals/Error-Messages')
//const hasPermission = auth.hasPermission;
const secret =  authConfig.secret;// used to create tokens
const salt = authConfig.salt; 
const tokenExpiresAfter = authConfig.tokenExpiresAfter;
// generic object send at response
const ResponseObject = require('../models/response_object');

// const messages
// for development purpose i "emailNotError"
// to 'user not found' but at deplyment
// you should replace it by "email or password is incorrect".
// the same for "passwordWrongError".

//
function getAll(req, res, next) {
    UserModel.find().
    then(doc =>{ 
        const resObject = new ResponseObject(
            req.user, doc
        );
        res.json(resObject);
    }).
    catch(err =>{
        // only connection errors
        if (err.name == 'CastError'){
            res.statusCode = 404;
            err.message = Errors.pageNotFoundError;
            next(err);
        }
        else{
        res.statusCode = 500;
        err.message = Errors.connectionError;
        next(err);
        }
    })
}

//
function getById(req, res, next) {
    UserModel.find({_id:req.params.id}).
    then(doc =>{
        const resObject = new ResponseObject(
            req.user, doc
        );
        res.json(resObject);
    }).
    catch(err =>{
        // errors are connection errors or
        // cast error
        if (err.name == 'CastError'){
            res.statusCode = 404;
            err.message = Errors.pageNotFoundError;
            next(err);
        }else{
            res.statusCode = 500;
            err.message = Errors.connectionError;
            next(err);
        }
    })
}

//
function create(req, res, next) {
    // use promises to keep order of excusion while
    // having ascyncronous nature of functions used
    // checks if email already exists
    const user = new UserModel(req.body);
    UserModel.findOne({email: user.email}).
    then((doc)=>{
        if(doc){
            res.statusCode = 400;
            const error = new Error(emailError);
            next(error);
        }else{
            // encrypt password to save
            // encryption is asyncrounous operation
            encryption.hash(user.password,salt).
            then(hash =>{
                user.password=hash; 
                return user ;
            }).
            then(user =>{
                user.save().
                then(v =>{
                    // if save success in returns null,
                    // but if fail throws error.
                    // validation occurs before saving
                    // save returns [connection | validation] errors
                    // when save success
                    const resObject = new ResponseObject(
                        req.user,
                        successMessage
                    );
                    res.json(resObject)
                }).
                catch(err =>{
                    // if errors occured at save phase
                    if(err.name == 'MongoError'){
                        res.statusCode =500;
                        const error = new Error(Errors.connectionError);
                        next (error);
                    }else{
                        // errors due to validation
                        res.satusCode = 400;
                        const error = new Error(Errors.requiredError);
                        next(error);
                    }
                })
            }).
            catch(err =>{
                // if no password is passed ecryption will throw error
                res.satusCode = 400;
                const error = new Error(Errors.passwordError);
                next(error); 
            }) 
        }
    }).
    catch(err =>{
        err.statusCode = 500;
        err.message = Errors.connectionError;
        next(err);
    })

}


// note => update dosen't validate data you send
// the next code modification will cover that 
function update(req, res, next){
    // two methods findOneAndUpdate and findByIdAndUpdate
    let update = req.body;
    UserModel.findByIdAndUpdate(req.params.id, update,(err, data)=>{
        if (err){
            if(err.name =='CastError'){
                res.ststusCode = 404;
                err.message =Errors.pageNotFoundError;
            }
            next(err);
        }else{
            const resObject = new ResponseObject(
                req.user,
                successMessage
            );
            res.json(resObject);
        }
    });
}



function delete_(req, res, next){
    UserModel.findByIdAndDelete(req.params.id,(err, data)=>{
        if (err){
            if(err.name =='CastError'){
                res.ststusCode = 404;
                err.message = Errors.pageNotFoundError;
            }
            next(err);
        }else{
            const resObj = new ResponseObject(
                req.user,
                successMessage
            )
            res.json(resObj);
        } 
    });
  
}


function signUp(req, res, next){
    // use promises to keep order of excusion while
    // having ascyncronous nature of functions used

    const user = new UserModel(req.body);
    // checks if email already exists
    UserModel.findOne({email: user.email}).
    then((doc)=>{
        if(doc){
            
            res.statusCode = 400;
            const error = new Error(Errors.emailError);
            next(error);
        }else{
            // encrypt password to save
            // note => encryption is asyncrounous operation
            encryption.hash(user.password,salt).
            then(hash =>{
                // sync operation so put in then to keep the order
                // instructions
                user.password = hash;
                user.role = 'guest'; // this is the difference between
                user.permissions = ['none']; //  signup and create user.
                // signup creates user with role guest no permissions
                // thus requires no permissions to create user.
                return user ;
            }).
            then(user=>{
                user.save().
                then(v =>{
                    const resObject = new ResponseObject(
                        req.user,
                        successMessage
                    );
                    res.json(resObject);
                }).
                catch(err=>{
                    // if errors occured at save phase
                    if(err.name == 'MongoError'){
                        res.statuscode = 500;
                        err.message = Errors.connectionError;
                        next(err);
                    }else{
                        res.statuscode = 400;
                        err.message = Errors.requiredError;
                        next(err);
                    }
                })
            }).
            catch(err=>{
                res.statusCode = 400;
                err.message = Errors.passwordError;
                next(err);
            }) // if no password is passed ecryption will throw error
        }
    }).
    catch(err =>{ 
        res.statusCode = 500;
        err.message = Errors.connectionError;
        next(err);
    })
}


function logIn(req, res, next){
    // first authenticate user 
    const user= new UserModel(req.body);
    UserModel.findOne({email: user.email}).
    then(doc =>{
        if(!doc){ // email existence check
            res.status(400);
            const error = new Error(Errors.emailNotError);
            return next(error);
            // use return else the program will flow after if.
        }
        encryption.compare(user.password, doc.password).
        then(result =>{
            if (result){
                // add user to session if password is correct
                let permissions = doc.permissions.toString();
                //console.log(doc);
                const token = jwt.sign(
                    {   
                        first_name: doc.first_name,
                        last_name: doc.last_name,
                        email: doc.email,
                        role: doc.role,
                        permissions:permissions
                    },
                    secret,
                    {expiresIn: tokenExpiresAfter}
                    );
                // here i use cookie to store token
                // you have the option to send token in json
                // with user data  and manage later which header 
                // to send , in token validation process
                res.clearCookie('sid'); // optional
                res.cookie(
                    'sid',token, 
                    { httpOnly: true }
                );
                const loggedUser ={
                    first_name: doc.first_name,
                    last_name: doc.last_name,
                    email: doc.email,
                    role: doc.role,
                    permissions: doc.permissions
                };
                const resObj = new ResponseObject(
                    loggedUser,{token:token}
                )
                res.json(resObj);
            }else{
                res.statusCode = 400;
                const error = new Error(Errors.passwordWrongError);
                next(error);
            }
        }).
        catch(err=>{
            res.statusCode = 400;
            const error = new Error(Errors.passwordError);
            next(error);
        })
    }).
    catch(err=>{
        res.statusCode = 500;
        const error = new Error(Errors.connectionError);
        next(error);
    })
};
//

function logOut(req, res, next){
    // logout depends on who control the token
    // in case of using cookie
    // sever can clear cookie so user is out .
    // incase of client has the token stored in
    // his cache its about him to remove the token
    
    // incase of client saved token logout  at client should
    // clear the token 
    // tokens cant be destroyed but they can expire.
    
    // this is the cookie case i clear the cookie
    res.clearCookie('sid');
    // send user ui data.
    //res.send({'success':'logged out'});
    const anonymousUser ={
        role:"",
        permissions:""
    }
    const resObj = new ResponseObject(
        anonymousUser,
        successMessage
    )
    res.json(resObj);
}

module.exports = {
    getAll: getAll,
    getById: getById,
    create: create,
    update: update,
    delete_: delete_,
    signUp: signUp,
    logIn: logIn,
    logOut: logOut 
}