// middle ware that exctract files from form and
//  handle write operation with file system then
//  returns (req, res, next) to the next middleware
// which is expected to be impelemented in the controller files
// because its spicific to models
//
// extracts docs ".pdf" and images ".png .jpg .jpeg" 
//
// config
const cnfgStatic = require('../configuration/static-config');
const imgMimeType = cnfgStatic.suppportedImgMimeType;
const docMimeType = cnfgStatic.suppportedDocMimeType;
const staticImgDir = cnfgStatic.staticImgDir;
const staticDocDir = cnfgStatic.staticDocDir;
const imgFieldName = cnfgStatic.imgFieldName;
const docFieldName = cnfgStatic.docFieldName;

// helping functions
const isStringInArray = require('../controllers/helping-controller');

// constructor of file excractor 
const multer = require('multer');

// configuring doc files extractor
const mixDocStorage = multer.diskStorage({
    // call back defines where to store docs
    // according to thier mime types.
    destination: function (req, file, cb) {
        if (isStringInArray(file.mimetype, imgMimeType)) {
            cb(null, staticImgDir);
        } else {
            cb(null, staticDocDir);
        }
    },
    // call back defines how to name extracted files.
    filename: function (req, file, cb) {
        cb(
            null,
            new Date().toISOString() + '-' + file.originalname
        );
    }
})

// configuring types that should be saved
const mixFilter = (req, file, cb) => {
    //cb(null, true) to accept that file
    //console.log(file, ' in fileFilter');
    if (isStringInArray(file.mimetype, imgMimeType)
        || isStringInArray(file.mimetype, docMimeType)) {
        cb(null, true)
    } else {
        //cb(null, false) to rejectc it
        cb(null, false)
    }
}

const mixExtractor = multer({
    storage: mixDocStorage,
    fileFilter: mixFilter
});


const fileSaver = (req, res, next) => {
    // instance of file saver
    // is generic  and used to test uplad success
    // each model that needs to do operation after 
    // writing files on file system  ex: "saving data in 
    // database".
    // must have its own
    // saver that implements that functionality.
    //
    if (req.files) {
        //
        // save that file ...........
        // 
        console.log(req.files); //
        const resObj = {
            current_user: req.user,
            data: {
                message: 'uploaded successfully',
                file: req.file,
                files: req.files
            }
        }
        res.json(resObj);
    } else {
        // no save case
        res.statusCode = 400;
        const resObj = {
            current_user: req.user,
            data: {
                message: 'upload failed unproper file format',
                //file: req.file
            }
        }
        res.json(resObj);
    }

};


module.exports = {
    mixExtractor: mixExtractor.fields(
        [
            {
                name: imgFieldName
            }, {
                name: docFieldName
            }
        ]
    ),
    fileSaver: fileSaver
}