//
//
//
// config

const cnfgStatic = require('../configuration/static-config');
const docMimeType = cnfgStatic.docMimeType;
const staticDocDir = cnfgStatic.staticDocDir;
const docFieldName = cnfgStatic.docFieldName;

// helping functions
const isStringInArray = require('../controllers/helping-controller');

// constructor of file excractor 
const multer = require('multer');

// configuring doc files extractor
const docStorage = multer.diskStorage({
    // call back defines where to store docs
    destination: function (req, file, cb) {
        cb(null, staticDocDir);
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
// in docs dir
const docFilter = (req, file, cb) => {
    //cb(null, true) to accept that file
    //console.log(file, ' in fileFilter');
    if ( isStringInArray(file.mimetype, docMimeType)) {
        cb(null, true)
    } else {
        //cb(null, false) to rejectc it
        cb(null, false)
    }
}

const docsExtractor = multer({
    storage: docStorage,
    fileFilter: docFilter
});


const fileSaver = (req, res, next) => {
    // instance of file saver
    // is generic  and used to test uplad system
    // each model that needs uploads must have its own
    // saver 
    if (req.files) {
        //
        // save that file ...........
        // 
        console.log(req.files); //
        const resObj = {
            current_user: req.user,
            data: {
                message: 'uploaded successfully',
                file: req.file
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


module.exports ={ 
    docsExtractor: docsExtractor.array(docFieldName),
    fileSaver: fileSaver
}