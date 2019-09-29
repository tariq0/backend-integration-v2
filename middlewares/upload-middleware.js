//
//
//
//  const var imports && defs
//

// these mime types used to filter data in submitted forms
const imageMimeType = ['image/png', 'image/jpg', 'image/jpeg'];
const documentMimeType = ['application/pdf'];

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/documents/doc')
    },
    filename: function (req, file, cb) {
        cb(
            null,
            new Date() + '-' + file.originalname
        );
    }
})



const imgFilter = (req, file, cb) => {
    //cb(null, true) to accept that file
    console.log(file, ' in fileFilter');
    if (
        file.mimetype == 'image/png'
        || file.mimetype == 'image/jpg'
        || file.mimetype == 'image/jpeg'
    ) {
        cb(null, true)
    } else {
        //cb(null, false) to rejectc it
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: imgFilter
});


const uploadManyPhotos = upload.array(fieldName_);
const uploadOnePhoto = upload(fieldName_);

app.post('/upload', upload.array('img'), (req, res, next) => {
    console.log('here', req.body.name, req.body.age);
    // next();
    if (req.files) {
        //
        // save that file ...........
        // 
        console.log(req.files);
        const resObj = {
            current_user: req.user,
            data: {
                message: 'uploaded successfully',
                file: req.file
            }
        }
        res.json(resObj);
    } else {
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

});



function isStingInArray(str, arrOfStrings) {
    if (Array.isArray(arrOfStrings)) {
        if (arrOfStrings.indexOf(str) > -1) {
            return true;
        } else
            return false;
    } else {
        const error =
            new Error('second parameter passed to "isStringInArray()" is not an array..');
        throw error;
    }
    //return 
}

function fileExtractor() {
    // set up  logic;
    // extract logic;
};

function fileSaver() {
    // save logic
};