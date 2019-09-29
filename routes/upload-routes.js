//
//
// file that contains upload routes
// separated to handle uplaod process individually.
// each route consits of path and handler
// handling uplaod is two step proccess
// 1- extract files 
// 2- save them in databse
// extractors may be generic
// savers depends on models so they are
// implemented in the specific controoler files.
//
//
const express = require('express');
const router = express.Router();

const PhotoAlbum = require('../controllers/photoalbum-controller');
const Publication = require('../controllers/publication-controller');
const News = require('../controllers/news-controller');

const photoAlbumSaver = PhotoAlbum.saver;
const publicationSaver = Publication.saver;
const newsSaver = News.saver;

const upDocs =
    require('../middlewares/doc-upload-middleware');

const upImgs =
    require('../middlewares/img-upload-middleware');

const upMix =
    require('../middlewares/mix-upload-middleware');


router.post( // for test
    '/doc',
    upDocs.docsExtractor,
    upDocs.fileSaver
);

router.post(
    '/photoalbum',
    upImgs.docsExtractor, // genric for all photo only forms
    photoAlbumSaver
);

router.post(
    '/publication',
    upMix.mixExtractor, // genric for all photo and pdf  
    publicationSaver
);

router.post(
    '/news',
    upMix.mixExtractor, // genric for all photo and pdf  
    newsSaver
);

router.post(
    '/mix',
    upMix.mixExtractor, // genric for all photo and pdf  
    upMix.fileSaver
);
router.use((err, req, res, next)=>{
    console.log(err);
    next(err);
});
module.exports = router;