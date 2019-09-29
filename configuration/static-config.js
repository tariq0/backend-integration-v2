//
// static files configuration file

const staticRootDir = './public';

const staticImgDir = './public/photos';
const staticImgUrl = '/photos/'; //used to costruct img url

// its not always good to store he whole path in data base since
// you may change the direcroties or even thier names
// so its best practice to save only file name
// and keep the dir name as variable and construct the
// url by adding them together 
// ex: "http:// <staticImgUrl>/<imName>"

const staticDocDir = './public/documents/';
const staticDocUrl = '/documents/'; //used to costruct docs url

// the following const are 
// used to filter content at upload to makesure only img files
// stored in photos dir and only pdf is stored in documents dir
// you can add another types to document if its required
const suppportedImgMimeType = ['image/png', 'image/jpg', 'image/jpeg'];
const suppportedDocMimeType = ['application/pdf'];

// names of form fields used to extract files and they must be
// the same as model fields
const imgFieldName = 'images';
const docFieldName = 'files';

const maxFileSize =''; // you can set that too but not implemented
// 

module.exports = {
    staticDocDir: staticDocDir,
    staticDocUrl: staticDocUrl,

    staticRootDir:staticRootDir,
    
    staticImgDir: staticImgDir,
    staticImgUrl: staticImgUrl,

    suppportedImgMimeType: suppportedImgMimeType,
    suppportedDocMimeType: suppportedDocMimeType,

    imgFieldName: imgFieldName,
    docFieldName: docFieldName
}